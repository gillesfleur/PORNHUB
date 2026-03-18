import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ actorId: string }> }
) {
  const resolvedParams = await params;
  const { actorId } = resolvedParams;

  // replaced params destructuring

  try {
    const user = await requireAuth(request)

    // Vérifier si l'acteur existe
    const actor = await prisma.actor.findUnique({ where: { id: actorId } })
    if (!actor) return errorResponse('Acteur non trouvé.', 404)

    const existing = await prisma.subscription.findUnique({
      where: {
        userId_actorId: {
          userId: user.id,
          actorId
        }
      }
    })

    let isSubscribed = false
    if (existing) {
      await prisma.subscription.delete({ where: { id: existing.id } })
      isSubscribed = false
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          actorId
        }
      })
      isSubscribed = true
    }

    return successResponse({ isSubscribed })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur abonnement.', 500)
  }
}
