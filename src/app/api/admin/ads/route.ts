import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDel } from '@/lib/redis'
import { PlacementType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const ads = await prisma.adPlacement.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return successResponse(ads)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur récupération pubs.', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { name, placementType, width, height, pages, adCode, isActive } = body

    if (!name || !placementType || !adCode) {
      return errorResponse('Données manquantes (nom, type, code pub).', 400)
    }

    const ad = await prisma.adPlacement.create({
      data: {
        name,
        placementType: placementType as PlacementType,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        pages: pages || [],
        adCode,
        isActive: isActive ?? true
      }
    })

    // Invalider le cache public
    await cacheDel('ads:active')

    return successResponse(ad, 'Emplacement pub créé.', 201)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_ADS_POST_ERROR]', error)
    return errorResponse('Erreur création pub.', 500)
  }
}
