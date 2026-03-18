import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    })
    return successResponse(settings)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur récupération paramètres.', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { settings } = await request.json()

    if (!Array.isArray(settings)) {
      return errorResponse('Le format des paramètres est invalide (doit être un tableau).', 400)
    }

    // Mise à jour en masse via transaction
    await prisma.$transaction(
      settings.map((s: { key: string; value: any }) => 
        prisma.siteSetting.upsert({
          where: { key: s.key },
          update: { value: String(s.value) },
          create: { key: s.key, value: String(s.value) }
        })
      )
    )

    // Invalider les caches globaux si nécessaire
    // On invalide tout ce qui pourrait dépendre des réglages
    await cacheDelPattern('*') 

    return successResponse(null, 'Paramètres mis à jour avec succès.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_SETTINGS_PUT_ERROR]', error)
    return errorResponse('Erreur mise à jour paramètres.', 500)
  }
}
