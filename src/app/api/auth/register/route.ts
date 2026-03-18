import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    // 1. Validation basics
    if (!username || !email || !password) {
      return errorResponse('Tous les champs sont obligatoires.', 400)
    }

    const emailValid = validateEmail(email)
    const passwordCheck = validatePassword(password)
    const usernameCheck = validateUsername(username)

    if (!emailValid) return errorResponse('Email invalide.', 400)
    if (!passwordCheck.valid) return errorResponse(passwordCheck.errors[0], 400)
    if (!usernameCheck.valid) return errorResponse(usernameCheck.errors[0], 400)

    // 2. Vérifier si l'email ou le username existent déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) return errorResponse('Cet email est déjà utilisé.', 409)
      if (existingUser.username === username) return errorResponse('Ce nom d’utilisateur est déjà pris.', 409)
    }

    // 3. Hasher le mot de passe
    const passwordHash = await hashPassword(password)

    // 4. Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'USER',
      },
    })

    // 5. Générer les tokens
    const accessToken = await generateAccessToken(user.id, user.role)
    const refreshToken = await generateRefreshToken(user.id)

    // 6. Réponse
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
      'Inscription réussie',
      201
    )
  } catch (error) {
    console.error('[REGISTER_ERROR]', error)
    return errorResponse('Une erreur est survenue lors de l’inscription.', 500)
  }
}
