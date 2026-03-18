import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring
  const cacheKey = `videos:detail:${slug}`

  // 1. Vérifier le cache
  const cached = await cacheGet(cacheKey)
  if (cached) {
    // Incrémenter les vues en tâche de fond même si c'est en cache
    incrementViews(slug)

    // Vérifier l'utilisateur même pour le cache
    const user = await getCurrentUser(request)
    let hasVoted = null
    let isFavorite = false

    if (user) {
      const videoId = (cached as any).id
      const [vote, favorite] = await Promise.all([
        prisma.videoVote.findUnique({
          where: { userId_videoId: { userId: user.id, videoId: videoId } }
        }),
        prisma.favorite.findUnique({
          where: { userId_videoId: { userId: user.id, videoId: videoId } }
        })
      ])
      hasVoted = vote ? vote.voteType : null
      isFavorite = !!favorite
    }

    return successResponse({
      ...cached,
      hasVoted,
      isFavorite
    }, 'OK (Cached)')
  }

  try {
    // 2. Requête BDD (Optimisation avec select)
    const video = await prisma.video.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        duration: true,
        durationFormatted: true,
        thumbnailUrl: true,
        videoUrl: true,
        viewsInternal: true,
        rating: true,
        likes: true,
        dislikes: true,
        quality: true,
        isFeatured: true,
        publishedAt: true,
        categoryId: true,
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        actors: { select: { actor: { select: { id: true, name: true, slug: true, imageUrl: true } } } }
      }
    })

    if (!video) {
      return errorResponse('Vidéo non trouvée.', 404)
    }

    // Formater
    const formattedVideo = {
      ...video,
      tags: video.tags.map(t => t.tag),
      actors: video.actors.map(a => a.actor)
    }

    // 3. Mettre en cache (5 minutes)
    await cacheSet(cacheKey, formattedVideo, 300)

    // 4. Ajouter les données utilisateur si connecté
    const user = await getCurrentUser(request)
    let hasVoted = null
    let isFavorite = false

    if (user) {
      const [vote, favorite] = await Promise.all([
        prisma.videoVote.findUnique({
          where: { userId_videoId: { userId: user.id, videoId: video.id } }
        }),
        prisma.favorite.findUnique({
          where: { userId_videoId: { userId: user.id, videoId: video.id } }
        })
      ])
      hasVoted = vote ? vote.voteType : null
      isFavorite = !!favorite
    }

    // 5. Incrémenter les vues (Async)
    incrementViews(slug)

    return successResponse({
      ...formattedVideo,
      hasVoted,
      isFavorite
    })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

/**
 * Fonction helper interne pour incrémenter les vues sans bloquer la requête.
 */
async function incrementViews(slug: string) {
  try {
    await prisma.video.update({
      where: { slug },
      data: { viewsInternal: { increment: 1 } }
    })
  } catch (e) {
    console.error(`[VIEW_INCREMENT_ERROR] slug: ${slug}`, e)
  }
}
