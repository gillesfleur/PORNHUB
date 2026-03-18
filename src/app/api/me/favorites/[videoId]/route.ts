import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const resolvedParams = await params;
  const { videoId } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring

    await prisma.favorite.delete({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId
        }
      }
    })

    return successResponse(null, 'Favori supprimé.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    // Si déjà supprimé ou n'existe pas, Prisma renverra une erreur spécifique, on peut la draper
    return successResponse(null, 'Favori déjà supprimé ou inexistant.')
  }
}
