import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            videoCount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(subscriptions.map(s => s.actor))
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  }
}
