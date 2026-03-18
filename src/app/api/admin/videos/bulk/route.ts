import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { videoIds, action } = await request.json()

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return errorResponse('Liste de vidéos vide.', 400)
    }

    // Récupérer les slugs pour le cache
    const videos = await prisma.video.findMany({
      where: { id: { in: videoIds } },
      select: { slug: true }
    })
    const slugs = videos.map(v => v.slug)

    switch (action) {
      case 'activate':
        await prisma.video.updateMany({ where: { id: { in: videoIds } }, data: { isActive: true } })
        break
      case 'deactivate':
        await prisma.video.updateMany({ where: { id: { in: videoIds } }, data: { isActive: false } })
        break
      case 'feature':
        // Note: updateMany doesn't support logical toggles easily across multiple entries
        // For 'feature', we'll set them all to true for simplicity in bulk
        await prisma.video.updateMany({ where: { id: { in: videoIds } }, data: { isFeatured: true } })
        break
      case 'delete':
        // Hard delete
        await prisma.video.deleteMany({ where: { id: { in: videoIds } } })
        break
      default:
        return errorResponse('Action invalide.', 400)
    }

    // Invalider les caches
    for (const slug of slugs) {
      await cacheDelPattern(`video:${slug}*`)
    }
    await cacheDelPattern('videos:*')

    return successResponse(null, `${videoIds.length} vidéos traitées.`)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_VIDEOS_BULK_ERROR]', error)
    return errorResponse('Erreur action en masse.', 500)
  }
}
