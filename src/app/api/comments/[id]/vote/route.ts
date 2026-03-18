import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { VoteType } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    const commentId = id
    const { type } = await request.json()

    if (!['like', 'dislike'].includes(type)) {
      return errorResponse('Type de vote invalide.', 400)
    }

    const voteType = type === 'like' ? VoteType.LIKE : VoteType.DISLIKE

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { video: { select: { slug: true } } }
    })

    if (!comment) return errorResponse('Commentaire non trouvé.', 404)

    const existingVote = await prisma.commentVote.findUnique({
      where: { userId_commentId: { userId: user.id, commentId } }
    })

    let result: 'like' | 'dislike' | null = null

    await prisma.$transaction(async (tx) => {
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Toggle off
          await tx.commentVote.delete({ where: { id: existingVote.id } })
          if (voteType === VoteType.LIKE) {
            await tx.comment.update({ where: { id: commentId }, data: { likes: { decrement: 1 } } })
          } else {
            await tx.comment.update({ where: { id: commentId }, data: { dislikes: { decrement: 1 } } })
          }
          result = null
        } else {
          // Change vote
          await tx.commentVote.update({ where: { id: existingVote.id }, data: { voteType } })
          if (voteType === VoteType.LIKE) {
            await tx.comment.update({
              where: { id: commentId },
              data: { likes: { increment: 1 }, dislikes: { decrement: 1 } }
            })
          } else {
            await tx.comment.update({
              where: { id: commentId },
              data: { likes: { decrement: 1 }, dislikes: { increment: 1 } }
            })
          }
          result = type as 'like' | 'dislike'
        }
      } else {
        // New vote
        await tx.commentVote.create({
          data: { userId: user.id, commentId, voteType }
        })
        if (voteType === VoteType.LIKE) {
          await tx.comment.update({ where: { id: commentId }, data: { likes: { increment: 1 } } })
        } else {
          await tx.comment.update({ where: { id: commentId }, data: { dislikes: { increment: 1 } } })
        }
        result = type as 'like' | 'dislike'
      }
    })

    // Récupérer les nouveaux compteurs
    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { likes: true, dislikes: true }
    })

    await cacheDelPattern(`comments:${comment.video.slug}:*`)

    return successResponse({
      voted: result,
      likes: updatedComment?.likes || 0,
      dislikes: updatedComment?.dislikes || 0
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur lors du vote.', 500)
  }
}
