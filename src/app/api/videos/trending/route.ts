import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))

  const cacheKey = `videos:trending:${page}:${perPage}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    // Note: Pour le prototype, trending = trié par viewsInternal desc
    const [total, videos] = await Promise.all([
      prisma.video.count({ where: { isActive: true } }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { viewsInternal: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          category: { select: { name: true, slug: true } }
        }
      })
    ])

    const result = { videos, total, page, perPage }
    await cacheSet(cacheKey, result, 600) // 10 minutes

    return successResponse(result)
  } catch (error) {
    return errorResponse('Erreur', 500)
  }
}
