import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDel } from '@/lib/redis'

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { orderedIds } = body as { orderedIds: string[] }

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return errorResponse('Liste d\'IDs ordonnée requise.', 400)
    }

    // Mise à jour séquentielle (ou Promise.all pour plus de rapidité)
    await Promise.all(
      orderedIds.map((id, index) => 
        prisma.category.update({
          where: { id },
          data: { sortOrder: index }
        })
      )
    )

    await cacheDel('categories:list')
    return successResponse(null, 'Ordre mis à jour')
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
