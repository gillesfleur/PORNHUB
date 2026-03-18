import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { CommentStatus, UserRole } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring
    const { content } = await request.json()

    if (!content || content.length < 2) return errorResponse('Contenu invalide.', 400)

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { video: { select: { slug: true } } }
    })

    if (!comment) return errorResponse('Commentaire non trouvé.', 404)
    if (comment.userId !== user.id) return errorResponse('Accès non autorisé.', 403)
    if (comment.status === CommentStatus.DELETED) return errorResponse('Commentaire déjà supprimé.', 400)

    // Fenêtre de 15 minutes
    const now = new Date()
    const diffMin = (now.getTime() - comment.createdAt.getTime()) / 60000
    if (diffMin > 15) {
      return errorResponse('Le commentaire ne peut plus être modifié après 15 minutes.', 403)
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content, updatedAt: now }
    })

    await cacheDelPattern(`comments:${comment.video.slug}:*`)

    return successResponse(updated, 'Commentaire mis à jour')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur lors de la modification.', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { video: { select: { slug: true } } }
    })

    if (!comment) return errorResponse('Commentaire non trouvé.', 404)
    
    // Auteur ou Admin
    if (comment.userId !== user.id && user.role !== UserRole.ADMIN) {
      return errorResponse('Accès non autorisé.', 403)
    }

    // Soft delete
    await prisma.comment.update({
      where: { id },
      data: {
        status: CommentStatus.DELETED,
        content: '[Commentaire supprimé]'
      }
    })

    await cacheDelPattern(`comments:${comment.video.slug}:*`)

    return successResponse(null, 'Commentaire supprimé.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur lors de la suppression.', 500)
  }
}
