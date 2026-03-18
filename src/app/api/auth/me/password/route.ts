import { NextRequest } from 'next/server'
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { errorResponse, successResponse } from '@/lib/api-response'
import { validatePassword } from '@/lib/validators'

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return errorResponse('Non autorisé.', 401)
  }

  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return errorResponse('Ancien et nouveau mots de passe requis.', 400)
    }

    // 1. Vérifier l'ancien mot de passe
    const isMatch = await verifyPassword(currentPassword, user.passwordHash)
    if (!isMatch) {
      return errorResponse('Mot de passe actuel incorrect.', 400)
    }

    // 2. Valider le nouveau mot de passe
    const passwordCheck = validatePassword(newPassword)
    if (!passwordCheck.valid) {
      return errorResponse(passwordCheck.errors[0], 400)
    }

    // 3. Hasher et mettre à jour
    const newHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    })

    return successResponse(null, 'Mot de passe mis à jour avec succès')
  } catch (error) {
    console.error('[PASSWORD_UPDATE_ERROR]', error)
    return errorResponse('Erreur lors du changement de mot de passe.', 500)
  }
}
