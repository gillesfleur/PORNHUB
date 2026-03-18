import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { CommentStatus } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring
    const { status } = await request.json()

    if (!Object.values(CommentStatus).includes(status)) {
      return errorResponse('Statut invalide.', 400)
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status: status as CommentStatus },
      include: { video: { select: { slug: true } } }
    })

    await cacheDelPattern(`comments:${comment.video.slug}:*`)

    return successResponse(comment, 'Statut mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur mise à jour statut.', 500)
  }
}
