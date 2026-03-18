import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring
    const { isActive } = await request.json()

    if (typeof isActive !== 'boolean') {
      return errorResponse('Valeur isActive invalide.', 400)
    }

    const video = await prisma.video.update({
      where: { id },
      data: { isActive }
    })

    await cacheDelPattern(`video:${video.slug}*`)
    await cacheDelPattern('videos:*')

    return successResponse({ isActive: video.isActive }, 'Statut mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur mise à jour statut.', 500)
  }
}
