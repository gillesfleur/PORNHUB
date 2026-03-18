import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))
  const sort = searchParams.get('sort') || 'recent'
  const quality = searchParams.get('quality')
  const duration = searchParams.get('duration')

  const cacheKey = `categories:${slug}:${JSON.stringify({ page, perPage, sort, quality, duration })}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    // 1. Trouver la catégorie (Optimisé avec select)
    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        videoCount: true
      }
    })

    if (!category) return errorResponse('Catégorie non trouvée.', 404)

    // 2. Filtres
    const where: Prisma.VideoWhereInput = { 
      categoryId: category.id,
      isActive: true 
    }

    if (quality) where.quality = quality as any
    if (duration) {
      if (duration === 'short') where.duration = { lt: 600 }
      else if (duration === 'medium') where.duration = { gte: 600, lte: 1800 }
      else if (duration === 'long') where.duration = { gt: 1800 }
    }

    // 3. Tri
    let orderBy: Prisma.VideoOrderByWithRelationInput = { publishedAt: 'desc' }
    if (sort === 'popular') orderBy = { viewsInternal: 'desc' }
    else if (sort === 'top-rated') orderBy = { rating: 'desc' }

    // 4. Requête
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
          thumbnailUrl: true,
          durationFormatted: true,
          viewsInternal: true,
          rating: true,
          quality: true,
          tags: { take: 3, select: { tag: { select: { name: true, slug: true } } } }
        }
      })
    ])

    const result = {
      category,
      videos: videos.map(v => ({ ...v, tags: v.tags.map(t => t.tag) })),
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, result, 300) // 5 minutes

    return successResponse(result)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
