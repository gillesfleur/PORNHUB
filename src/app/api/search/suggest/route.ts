import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return successResponse({ videos: [], categories: [], actors: [] })
  }

  const cacheKey = `search:suggest:${q.toLowerCase()}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const [videos, categories, actors] = await Promise.all([
      prisma.video.findMany({
        where: { title: { contains: q, mode: 'insensitive' }, isActive: true },
        take: 5,
        select: { title: true, slug: true }
      }),
      prisma.category.findMany({
        where: { name: { contains: q, mode: 'insensitive' }, isActive: true },
        take: 3,
        select: { name: true, slug: true }
      }),
      prisma.actor.findMany({
        where: { name: { contains: q, mode: 'insensitive' }, isActive: true },
        take: 3,
        select: { name: true, slug: true }
      })
    ])

    const result = { videos, categories, actors }
    await cacheSet(cacheKey, result, 30) // 30 seconds

    return successResponse(result)
  } catch (error) {
    return errorResponse('Erreur suggestions.', 500)
  }
}
