import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring
  const cacheKey = `videos:related:${slug}`

  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    // 1. Récupérer les infos de la vidéo actuelle (catégorie et tags)
    const currentVideo = await prisma.video.findUnique({
      where: { slug },
      select: {
        id: true,
        categoryId: true,
        tags: { select: { tagId: true } }
      }
    })

    if (!currentVideo) return errorResponse('Vidéo non trouvée', 404)

    const tagIds = currentVideo.tags.map(t => t.tagId)

    // 2. Trouver des vidéos similaires
    // Tri par : catégorie identique d'abord, puis par nombre de tags communs, puis par vues
    const relatedVideos = await prisma.video.findMany({
      where: {
        isActive: true,
        id: { not: currentVideo.id },
        OR: [
          { categoryId: currentVideo.categoryId },
          { tags: { some: { tagId: { in: tagIds } } } }
        ]
      },
      take: 10,
      orderBy: [
        { viewsInternal: 'desc' },
        { publishedAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnailUrl: true,
        durationFormatted: true,
        viewsInternal: true,
        rating: true,
        quality: true
      }
    })

    await cacheSet(cacheKey, relatedVideos, 600) // 10 minutes

    return successResponse(relatedVideos)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
