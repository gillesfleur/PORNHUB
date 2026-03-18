import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    const playlistId = id
    const { videoId } = await request.json()

    if (!videoId) return errorResponse('VideoId requis.', 400)

    // Vérifier propriété playlist
    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId: user.id }
    })
    if (!playlist) return errorResponse('Playlist non trouvée.', 404)

    // Vérifier si déjà présent
    const existing = await prisma.playlistVideo.findUnique({
      where: {
        playlistId_videoId: { playlistId, videoId }
      }
    })
    if (existing) return errorResponse('Vidéo déjà dans la playlist.', 409)

    // Ajouter à la fin
    await prisma.$transaction(async (tx) => {
      const lastVideo = await tx.playlistVideo.findFirst({
        where: { playlistId },
        orderBy: { position: 'desc' }
      })

      const newPosition = (lastVideo?.position ?? -1) + 1

      await tx.playlistVideo.create({
        data: {
          playlistId,
          videoId,
          position: newPosition
        }
      })

      await tx.playlist.update({
        where: { id: playlistId },
        data: { videoCount: { increment: 1 } }
      })
    })

    return successResponse(null, 'Vidéo ajoutée à la playlist.', 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur ajout vidéo.', 500)
  }
}
