import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, videoId: string }> }
) {
  const resolvedParams = await params;
  const { id, videoId } = resolvedParams;

  try {
    const user = await requireAuth(request)
    const { id: playlistId, videoId } = params

    // Vérifier propriété playlist
    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId: user.id }
    })
    if (!playlist) return errorResponse('Playlist non trouvée.', 404)

    // Supprimer et réordonner
    await prisma.$transaction(async (tx) => {
      const rel = await tx.playlistVideo.findUnique({
        where: { playlistId_videoId: { playlistId, videoId } }
      })

      if (!rel) return

      await tx.playlistVideo.delete({
        where: { playlistId_videoId: { playlistId, videoId } }
      })

      // Décaler les positions suivantes
      await tx.playlistVideo.updateMany({
        where: {
          playlistId,
          position: { gt: rel.position }
        },
        data: {
          position: { decrement: 1 }
        }
      })

      await tx.playlist.update({
        where: { id: playlistId },
        data: { videoCount: { decrement: 1 } }
      })
    })

    return successResponse(null, 'Vidéo retirée de la playlist.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur suppression vidéo.', 500)
  }
}
