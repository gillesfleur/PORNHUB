import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'all' // today, week, month, all
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))

  // 2. Gestion du Cache
  const cacheKey = `videos:popular:${period}:${page}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const where: Prisma.VideoWhereInput = { isActive: true }
    
    // Filtrage par période (basé sur publishedAt pour simplifier le prototype)
    const now = new Date()
    if (period === 'today') {
      where.publishedAt = { gte: new Date(now.setDate(now.getDate() - 1)) }
    } else if (period === 'week') {
      where.publishedAt = { gte: new Date(now.setDate(now.getDate() - 7)) }
    } else if (period === 'month') {
      where.publishedAt = { gte: new Date(now.setMonth(now.getMonth() - 1)) }
    }

    const [total, videos] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy: { viewsInternal: 'desc' },
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
          category: { select: { name: true, slug: true } }
        }
      })
    ])

    const result = { videos, total, page, perPage }
    await cacheSet(cacheKey, result, 300) // 5 minutes

    return successResponse(result)
  } catch (error) {
    return errorResponse('Erreur', 500)
  }
}
