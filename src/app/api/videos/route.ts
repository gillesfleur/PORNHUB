import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // 1. Paramètres
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '24')))
  const sort = searchParams.get('sort') || 'recent'
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const quality = searchParams.get('quality')
  const duration = searchParams.get('duration')

  // 2. Gestion du Cache
  const cacheKey = `videos:list:${JSON.stringify({ page, perPage, sort, category, tag, quality, duration })}`
  const cachedData = await cacheGet(cacheKey)
  if (cachedData) return successResponse(cachedData, 'OK (Cached)')

  try {
    // 3. Construction des filtres Prisma
    const where: Prisma.VideoWhereInput = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (tag) {
      where.tags = { some: { tag: { slug: tag } } }
    }

    if (quality) {
      where.quality = quality as any
    }

    if (duration) {
      if (duration === 'short') where.duration = { lt: 600 } // < 10min
      else if (duration === 'medium') where.duration = { gte: 600, lte: 1800 } // 10-30min
      else if (duration === 'long') where.duration = { gt: 1800 } // > 30min
    }

    // 4. Tri
    let orderBy: Prisma.VideoOrderByWithRelationInput = { publishedAt: 'desc' }
    if (sort === 'popular') orderBy = { viewsInternal: 'desc' }
    else if (sort === 'top-rated') orderBy = { rating: 'desc' }
    else if (sort === 'longest') orderBy = { duration: 'desc' }
    else if (sort === 'shortest') orderBy = { duration: 'asc' }

    // 5. Requête
    const [total, videos] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          title: true,
          slug: true,
          duration: true,
          durationFormatted: true,
          viewsInternal: true,
          rating: true,
          likes: true,
          dislikes: true,
          thumbnailUrl: true,
          quality: true,
          isFeatured: true,
          publishedAt: true,
          category: { select: { name: true, slug: true } },
          tags: {
            take: 5,
            select: { tag: { select: { name: true, slug: true } } }
          },
          actors: {
            select: { actor: { select: { name: true, slug: true } } }
          }
        }
      })
    ])

    // Mapper les relations pour aplatir le format (tags/actors)
    const formattedVideos = videos.map(v => ({
      ...v,
      tags: v.tags.map(t => t.tag),
      actors: v.actors.map(a => a.actor)
    }))

    const result = {
      videos: formattedVideos,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    }

    // 6. Mise en cache (2 minutes)
    await cacheSet(cacheKey, result, 120)

    return successResponse(result)
  } catch (error: any) {
    console.error('[VIDEOS_LIST_ERROR]', error)
    return errorResponse('Erreur lors de la récupération des vidéos.', 500)
  }
}
