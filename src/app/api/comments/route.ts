import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { CommentStatus } from '@prisma/client'
import { sanitizeInput, validateId, validateLength } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { videoId, content, parentId } = body

    if (!videoId || !content || !validateId(videoId)) {
      return errorResponse('Données invalides. ID vidéo incorrect.', 400)
    }

    if (!validateLength(content, 2, 1000)) {
      return errorResponse('Le contenu doit faire entre 2 et 1000 caractères.', 400)
    }

    if (parentId && !validateId(parentId)) {
      return errorResponse('ID parent incorrect.', 400)
    }

    const sanitizedContent = sanitizeInput(content, true)

    // Vérifier si la vidéo existe
    const video = await prisma.video.findUnique({ where: { id: videoId }, select: { slug: true } })
    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    // Si réponse, vérifier le parent
    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } })
      if (!parent || parent.videoId !== videoId) {
        return errorResponse('Commentaire parent invalide.', 400)
      }
      // On n'autorise qu'un niveau de profondeur pour le prototype
      if (parent.parentId) {
        return errorResponse('La profondeur maximale des réponses est de 1.', 400)
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        videoId,
        parentId: parentId || null,
        content: sanitizedContent,
        status: CommentStatus.PUBLISHED // Prototype: tout est publié direct
      },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } }
      }
    })

    // Invalider le cache des commentaires de cette vidéo
    await cacheDelPattern(`comments:${video.slug}:*`)

    return successResponse(comment, 'Commentaire ajouté.', 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    console.error('[CREATE_COMMENT_ERROR]', error)
    return errorResponse('Erreur lors de l’ajout du commentaire.', 500)
  }
}
