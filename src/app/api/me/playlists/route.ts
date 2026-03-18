import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const playlists = await prisma.playlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        videos: {
          take: 4,
          orderBy: { position: 'asc' },
          select: {
            video: {
              select: { thumbnailUrl: true }
            }
          }
        }
      }
    })

    const result = playlists.map((p: any) => ({
      ...p,
      thumbnails: p.videos.map((pv: any) => pv.video.thumbnailUrl)
    }))

    return successResponse(result)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur playlists.', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    const { name, description, isPublic } = body

    if (!name) return errorResponse('Le nom est requis.', 400)

    const playlist = await prisma.playlist.create({
      data: {
        userId: user.id,
        name,
        description,
        isPublic: isPublic !== undefined ? isPublic : true
      }
    })

    return successResponse(playlist, 'Playlist créée', 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur création playlist.', 500)
  }
}
