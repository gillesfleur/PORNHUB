import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-response'
import { sanitizeInput, validateUsername } from '@/lib/validators'

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return errorResponse('Non autorisé.', 401)
  }

  // Retourner les infos sans le passwordHash
  const { passwordHash, ...safeUser } = user
  return successResponse(safeUser)
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return errorResponse('Non autorisé.', 401)
  }

  try {
    const body = await request.json()
    const { username, avatarUrl, bio, preferences } = body

    const updateData: any = {}

    if (username !== undefined) {
      const usernameCheck = validateUsername(username)
      if (!usernameCheck.valid) return errorResponse(usernameCheck.errors[0], 400)
      
      // Vérifier si le username est déjà pris par un autre
      const existing = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: user.id }
        }
      })
      if (existing) return errorResponse('Ce nom d’utilisateur est déjà pris.', 409)
      
      updateData.username = username
    }

    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
    if (bio !== undefined) updateData.bio = sanitizeInput(bio)
    if (preferences !== undefined) updateData.preferences = preferences

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    const { passwordHash: _, ...safeUser } = updatedUser
    return successResponse(safeUser, 'Profil mis à jour')
  } catch (error) {
    console.error('[ME_UPDATE_ERROR]', error)
    return errorResponse('Erreur lors de la mise à jour du profil.', 500)
  }
}
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return errorResponse('Non autorisé.', 401)
  }

  try {
    const body = await request.json()
    const { confirmation } = body

    if (confirmation !== 'SUPPRIMER') {
      return errorResponse('Veuillez entrer "SUPPRIMER" pour confirmer.', 400)
    }

    // Suppression en cascade + Désactivation
    await prisma.$transaction([
      prisma.favorite.deleteMany({ where: { userId: user.id } }),
      prisma.watchHistory.deleteMany({ where: { userId: user.id } }),
      prisma.playlist.deleteMany({ where: { userId: user.id } }),
      prisma.comment.deleteMany({ where: { userId: user.id } }),
      prisma.videoVote.deleteMany({ where: { userId: user.id } }),
      prisma.commentVote.deleteMany({ where: { userId: user.id } }),
      prisma.subscription.deleteMany({ where: { userId: user.id } }),
      prisma.user.update({
        where: { id: user.id },
        data: { isActive: false }
      })
    ])

    return successResponse(null, 'Votre compte a été désactivé avec succès.')
  } catch (error) {
    console.error('[ACCOUNT_DELETE_ERROR]', error)
    return errorResponse('Erreur lors de la désactivation du compte.', 500)
  }
}
