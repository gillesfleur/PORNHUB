import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const user = await requireAuth(request)
    // replaced params destructuring

    // Vérifier que l'entrée appartient à l'utilisateur
    const entry = await prisma.watchHistory.findFirst({
      where: { id, userId: user.id }
    })

    if (!entry) return errorResponse('Entrée non trouvée.', 404)

    await prisma.watchHistory.delete({ where: { id } })

    return successResponse(null, 'Entrée supprimée.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur suppression entrée.', 500)
  }
}
