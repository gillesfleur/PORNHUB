import { NextRequest } from 'next/server'
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return errorResponse('Refresh token requis.', 400)
    }

    // 1. Vérifier le refresh token
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      return errorResponse('Token invalide ou expiré.', 401)
    }

    // 2. Vérifier que l'utilisateur existe toujours et est actif
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.isActive) {
      return errorResponse('Utilisateur non trouvé ou inactif.', 401)
    }

    // 3. Générer un nouveau access token
    const accessToken = await generateAccessToken(user.id, user.role)

    return successResponse({ accessToken }, 'Token rafraîchi')
  } catch (error) {
    console.error('[REFRESH_ERROR]', error)
    return errorResponse('Une erreur est survenue lors du rafraîchissement du token.', 500)
  }
}
