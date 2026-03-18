import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring

    const playlist = await prisma.playlist.findFirst({
      where: { id, userId: user.id },
      include: {
        videos: {
          orderBy: { position: 'asc' },
          include: {
            video: {
              include: {
                category: { select: { name: true, slug: true } }
              }
            }
          }
        }
      }
    })

    if (!playlist) return errorResponse('Playlist non trouvée.', 404)

    const result = {
      ...playlist,
      videos: playlist.videos.map(pv => ({
        ...pv.video,
        position: pv.position,
        addedAt: pv.addedAt
      }))
    }

    return successResponse(result)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur playlist.', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring
    const body = await request.json()

    const playlist = await prisma.playlist.findFirst({
      where: { id, userId: user.id }
    })

    if (!playlist) return errorResponse('Playlist non trouvée.', 404)

    const updated = await prisma.playlist.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        isPublic: body.isPublic
      }
    })

    return successResponse(updated, 'Playlist mise à jour')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur mise à jour playlist.', 500)
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

    const playlist = await prisma.playlist.findFirst({
      where: { id, userId: user.id }
    })

    if (!playlist) return errorResponse('Playlist non trouvée.', 404)

    await prisma.playlist.delete({ where: { id } })

    return successResponse(null, 'Playlist supprimée')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur suppression playlist.', 500)
  }
}
