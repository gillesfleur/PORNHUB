import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  const cacheKey = 'ads:active'
  
  try {
    const cached = await cacheGet(cacheKey)
    if (cached) return successResponse(cached, 'OK (Cached)')

    const ads = await prisma.adPlacement.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        placementType: true,
        width: true,
        height: true,
        pages: true,
        adCode: true
      }
    })

    await cacheSet(cacheKey, ads, 3600) // 1 heure

    return successResponse(ads)
  } catch (error) {
    console.error('[ADS_ACTIVE_ERROR]', error)
    return errorResponse('Erreur récupération pubs actives.', 500)
  }
}
