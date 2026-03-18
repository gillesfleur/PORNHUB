import { getCurrentUser } from './auth'
import { User } from '@prisma/client'

/**
 * Helper pour exiger une authentification dans un Route Handler.
 * Récupère l'utilisateur complet depuis la BDD.
 */
export async function requireAuth(request: Request): Promise<User> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

/**
 * Helper pour exiger le rôle ADMIN dans un Route Handler.
 */
export async function requireAdmin(request: Request): Promise<User> {
  const user = await requireAuth(request)

  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }

  return user
}
