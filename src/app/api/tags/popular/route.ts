import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const cacheKey = 'tags:popular'
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { videoCount: 'desc' },
      take: 30,
      select: {
        id: true,
        name: true,
        slug: true,
        videoCount: true
      }
    })

    await cacheSet(cacheKey, tags, 3600) // 1 hour

    return successResponse(tags)
  } catch (error) {
    return errorResponse('Erreur tags populaires.', 500)
  }
}
