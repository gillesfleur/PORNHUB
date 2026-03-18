import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const admin = await requireAdmin(request)
    // replaced params destructuring
    const { isActive, reason } = await request.json()

    if (typeof isActive !== 'boolean') {
      return errorResponse('Statut isActive invalide.', 400)
    }

    if (admin.id === id && !isActive) {
      return errorResponse('Vous ne pouvez pas désactiver votre propre compte admin.', 400)
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive }
    })

    // On pourrait logguer 'reason' dans une table d'audit ici

    return successResponse({ isActive: user.isActive }, 'Statut utilisateur mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_USER_STATUS_ERROR]', error)
    return errorResponse('Erreur mise à jour statut.', 500)
  }
}
