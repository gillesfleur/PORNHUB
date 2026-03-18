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
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '20'))

  const cacheKey = `actor:profile:${slug}:${page}:${perPage}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const actor = await prisma.actor.findUnique({
      where: { slug, isActive: true }
    })

    if (!actor) return errorResponse('Acteur non trouvé.', 404)

    // Vidéos de l'acteur
    const [total, videos] = await Promise.all([
      prisma.videoActor.count({ where: { actorId: actor.id, video: { isActive: true } } }),
      prisma.videoActor.findMany({
        where: { actorId: actor.id, video: { isActive: true } },
        orderBy: { video: { publishedAt: 'desc' } },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          video: {
            include: {
              category: { select: { name: true, slug: true } }
            }
          }
        }
      })
    ])

    const result = {
      actor,
      videos: videos.map(va => va.video),
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, result, 600) // 10 minutes

    return successResponse(result)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
