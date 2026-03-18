import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring

  try {
    const user = await requireAuth(request)
    
    const video = await prisma.video.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    // Vérifier si déjà en favori
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: video.id
        }
      }
    })

    let isFavorited = false

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      isFavorited = false
    } else {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          videoId: video.id
        }
      })
      isFavorited = true
    }

    return successResponse({ isFavorited })

  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur lors de la gestion du favori.', 500)
  }
}
