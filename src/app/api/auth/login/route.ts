import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email et mot de passe requis.', 400)
    }

    // 1. Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return errorResponse('Identifiants invalides.', 401)
    }

    // 2. Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return errorResponse('Identifiants invalides.', 401)
    }

    // 3. Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return errorResponse('Compte désactivé.', 403)
    }

    // 4. Mettre à jour lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // 5. Générer les tokens
    const accessToken = await generateAccessToken(user.id, user.role)
    const refreshToken = await generateRefreshToken(user.id)

    return successResponse(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
      'Connexion réussie'
    )
  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return errorResponse('Une erreur est survenue lors de la connexion.', 500)
  }
}
