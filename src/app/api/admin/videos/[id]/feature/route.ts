import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring

    const video = await prisma.video.findUnique({ where: { id } })
    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    const updated = await prisma.video.update({
      where: { id },
      data: { isFeatured: !video.isFeatured }
    })

    await cacheDelPattern(`video:${video.slug}*`)
    await cacheDelPattern('videos:*')

    return successResponse({ isFeatured: updated.isFeatured }, 'Statut mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur toggle feature.', 500)
  }
}
