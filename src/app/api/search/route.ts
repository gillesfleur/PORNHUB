import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const type = searchParams.get('type') || 'videos'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))
  const sort = searchParams.get('sort') || 'relevance'

  if (!q || q.length < 2) {
    return errorResponse('La recherche doit contenir au moins 2 caractères.', 400)
  }

  const cacheKey = `search:${JSON.stringify({ q, type, page, perPage, sort })}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    let results: any[] = []
    let total = 0

    if (type === 'videos') {
      const videoWhere: Prisma.VideoWhereInput = {
        isActive: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
          { category: { name: { contains: q, mode: 'insensitive' } } }
        ]
      }

      let orderBy: Prisma.VideoOrderByWithRelationInput = { viewsInternal: 'desc' }
      if (sort === 'recent') orderBy = { publishedAt: 'desc' }
      else if (sort === 'top-rated') orderBy = { rating: 'desc' }

      const [count, videos] = await Promise.all([
        prisma.video.count({ where: videoWhere }),
        prisma.video.findMany({
          where: videoWhere,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
            durationFormatted: true,
            viewsInternal: true,
            rating: true,
            quality: true,
            category: { select: { name: true, slug: true } },
            tags: { take: 3, select: { tag: { select: { name: true, slug: true } } } }
          }
        })
      ])
      total = count
      results = videos.map((v: any) => ({ ...v, tags: v.tags.map((t: any) => t.tag) }))
    } 
    
    else if (type === 'actors') {
      const actorWhere: Prisma.ActorWhereInput = {
        isActive: true,
        name: { contains: q, mode: 'insensitive' }
      }
      const [count, actors] = await Promise.all([
        prisma.actor.count({ where: actorWhere }),
        prisma.actor.findMany({
          where: actorWhere,
          orderBy: { videoCount: 'desc' },
          skip: (page - 1) * perPage,
          take: perPage,
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            gender: true,
            videoCount: true
          }
        })
      ])
      total = count
      results = actors
    } 
    
    else if (type === 'categories') {
      const catWhere: Prisma.CategoryWhereInput = {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      }
      const [count, categories] = await Promise.all([
        prisma.category.count({ where: catWhere }),
        prisma.category.findMany({
          where: catWhere,
          orderBy: { videoCount: 'desc' },
          skip: (page - 1) * perPage,
          take: perPage,
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            videoCount: true
          }
        })
      ])
      total = count
      results = categories
    }

    const payload = {
      results,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, payload, 120) // 2 minutes

    return successResponse(payload)
  } catch (error: any) {
    console.error('[SEARCH_ERROR]', error)
    return errorResponse('Erreur lors de la recherche.', 500)
  }
}
