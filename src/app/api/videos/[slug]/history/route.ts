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
    const body = await request.json()
    const { watchDuration, completed } = body

    const video = await prisma.video.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    // Vérifier le dernier record pour cette vidéo dans les dernières 24h
    const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const lastHistory = await prisma.watchHistory.findFirst({
      where: {
        userId: user.id,
        videoId: video.id,
        watchedAt: { gte: threshold }
      },
      orderBy: { watchedAt: 'desc' }
    })

    if (lastHistory) {
      await prisma.watchHistory.update({
        where: { id: lastHistory.id },
        data: {
          watchDuration: watchDuration || lastHistory.watchDuration,
          completed: completed !== undefined ? completed : lastHistory.completed,
          watchedAt: new Date() // Actualiser la date
        }
      })
    } else {
      await prisma.watchHistory.create({
        data: {
          userId: user.id,
          videoId: video.id,
          watchDuration: watchDuration || 0,
          completed: completed || false
        }
      })
    }

    return successResponse(null, 'Historique mis à jour')

  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur historique.', 500)
  }
}
