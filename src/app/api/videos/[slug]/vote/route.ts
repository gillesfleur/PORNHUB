import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDel } from '@/lib/redis'
import { VoteType } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring
  
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { type } = body as { type: 'LIKE' | 'DISLIKE' }

    if (!type || !['LIKE', 'DISLIKE'].includes(type)) {
      return errorResponse('Type de vote invalide.', 400)
    }

    const video = await prisma.video.findUnique({
      where: { slug },
      select: { id: true, likes: true, dislikes: true }
    })

    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    // 1. Vérifier si un vote existe déjà
    const existingVote = await prisma.videoVote.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: video.id
        }
      }
    })

    let finalVote: VoteType | null = type as VoteType
    let likesDelta = 0
    let dislikesDelta = 0

    if (existingVote) {
      if (existingVote.voteType === type) {
        // Toggle OFF : suppression du même vote
        await prisma.videoVote.delete({ where: { id: existingVote.id } })
        finalVote = null
        if (type === 'LIKE') likesDelta = -1
        else dislikesDelta = -1
      } else {
        // Changement de vote
        await prisma.videoVote.update({
          where: { id: existingVote.id },
          data: { voteType: type as VoteType }
        })
        if (type === 'LIKE') {
          likesDelta = 1
          dislikesDelta = -1
        } else {
          likesDelta = -1
          dislikesDelta = 1
        }
      }
    } else {
      // Nouveau vote
      await prisma.videoVote.create({
        data: {
          userId: user.id,
          videoId: video.id,
          voteType: type as VoteType
        }
      })
      if (type === 'LIKE') likesDelta = 1
      else dislikesDelta = 1
    }

    // 2. Mettre à jour les compteurs de la vidéo
    const updatedVideo = await prisma.video.update({
      where: { id: video.id },
      data: {
        likes: { increment: likesDelta },
        dislikes: { increment: dislikesDelta },
        rating: video.likes + likesDelta + video.dislikes + dislikesDelta > 0 
          ? Math.round(((video.likes + likesDelta) / (video.likes + likesDelta + video.dislikes + dislikesDelta)) * 100)
          : 0
      }
    })

    // 3. Invalider le cache
    await cacheDel(`video:detail:${slug}`)

    return successResponse({
      voted: finalVote,
      likes: updatedVideo.likes,
      dislikes: updatedVideo.dislikes
    })

  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    console.error('[VOTE_ERROR]', error)
    return errorResponse('Erreur lors du vote.', 500)
  }
}
