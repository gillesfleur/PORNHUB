import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDel } from '@/lib/redis'
import { PlacementType } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring
    const body = await request.json()
    const { name, placementType, width, height, pages, adCode, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (placementType !== undefined) updateData.placementType = placementType as PlacementType
    if (width !== undefined) updateData.width = width ? parseInt(width) : null
    if (height !== undefined) updateData.height = height ? parseInt(height) : null
    if (pages !== undefined) updateData.pages = pages
    if (adCode !== undefined) updateData.adCode = adCode
    if (isActive !== undefined) updateData.isActive = isActive

    const ad = await prisma.adPlacement.update({
      where: { id },
      data: updateData
    })

    await cacheDel('ads:active')

    return successResponse(ad, 'Emplacement pub mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur mise à jour pub.', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring

    await prisma.adPlacement.delete({ where: { id } })
    await cacheDel('ads:active')

    return successResponse(null, 'Emplacement pub supprimé.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur suppression pub.', 500)
  }
}
