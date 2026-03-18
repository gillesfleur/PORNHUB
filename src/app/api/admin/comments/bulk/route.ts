import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { CommentStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { commentIds, action } = await request.json()

    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      return errorResponse('Liste de commentaires vide.', 400)
    }

    let status: CommentStatus
    switch (action) {
      case 'approve': status = CommentStatus.PUBLISHED; break
      case 'reject': status = CommentStatus.REJECTED; break
      case 'delete': status = CommentStatus.DELETED; break
      default: return errorResponse('Action invalide.', 400)
    }

    // Récupérer les slugs de vidéos pour invalider le cache après
    const comments = await prisma.comment.findMany({
      where: { id: { in: commentIds } },
      select: { video: { select: { slug: true } } }
    })
    const slugs = Array.from(new Set(comments.map(c => c.video.slug)))

    await prisma.comment.updateMany({
      where: { id: { in: commentIds } },
      data: { 
        status,
        content: action === 'delete' ? '[Commentaire supprimé]' : undefined
      }
    })

    // Invalider les caches
    for (const slug of slugs) {
      await cacheDelPattern(`comments:${slug}:*`)
    }

    return successResponse(null, `${commentIds.length} commentaires mis à jour.`)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur action en masse.', 500)
  }
}
