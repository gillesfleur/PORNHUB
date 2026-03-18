import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
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

  const cacheKey = `tag:detail:${slug}:${JSON.stringify({ page, perPage, sort })}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const tag = await prisma.tag.findUnique({ where: { slug } })
    if (!tag) return errorResponse('Tag non trouvé.', 404)

    const where: Prisma.VideoWhereInput = {
      isActive: true,
      tags: { some: { tagId: tag.id } }
    }

    let orderBy: Prisma.VideoOrderByWithRelationInput = { publishedAt: 'desc' }
    if (sort === 'popular') orderBy = { viewsInternal: 'desc' }

    const [total, videos] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          category: { select: { name: true, slug: true } }
        }
      })
    ])

    const result = {
      tag,
      videos,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, result, 300) // 5 minutes

    return successResponse(result)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
