import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    // Nuclear clear: wipe everything
    await cacheDelPattern('*')

    return successResponse(null, 'Cache global vidé avec succès.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur nettoyage cache.', 500)
  }
}
