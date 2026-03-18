import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma, Gender } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))
  const search = searchParams.get('search')
  const gender = searchParams.get('gender') as Gender | null
  const sort = searchParams.get('sort') || 'popular' // popular | alpha | most-videos

  const cacheKey = `actors:list:${JSON.stringify({ page, perPage, search, gender, sort })}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const where: Prisma.ActorWhereInput = { isActive: true }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (gender && Object.values(Gender).includes(gender)) {
      where.gender = gender
    }

    let orderBy: Prisma.ActorOrderByWithRelationInput = { videoCount: 'desc' }
    if (sort === 'alpha') orderBy = { name: 'asc' }
    else if (sort === 'most-videos') orderBy = { videoCount: 'desc' }
    else if (sort === 'popular') orderBy = { totalViews: 'desc' }

    const [total, actors] = await Promise.all([
      prisma.actor.count({ where }),
      prisma.actor.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          name: true,
          slug: true,
          gender: true,
          imageUrl: true,
          videoCount: true,
          totalViews: true,
          nationality: true
        }
      })
    ])

    const result = {
      actors,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, result, 900) // 15 minutes

    return successResponse(result)
  } catch (error: any) {
    return errorResponse('Erreur acteurs.', 500)
  }
}
