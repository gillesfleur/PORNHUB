import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const cacheKey = 'categories:all'

  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        videoCount: true
      }
    })

    await cacheSet(cacheKey, categories, 1800) // 30 minutes

    return successResponse(categories)
  } catch (error: any) {
    return errorResponse('Erreur catégories.', 500)
  }
}
