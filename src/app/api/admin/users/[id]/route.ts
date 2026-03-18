import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { getCurrentUser } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            comments: true,
            favorites: true,
            playlists: true,
            subscriptions: true,
            watchHistory: true
          }
        }
      }
    })

    if (!user) return errorResponse('Utilisateur non trouvé.', 404)

    // On récupère aussi la dernière activité
    const lastActivity = await prisma.watchHistory.findFirst({
      where: { userId: id },
      orderBy: { watchedAt: 'desc' },
      include: { video: { select: { title: true, slug: true } } }
    })

    const { passwordHash, ...safeUser } = user

    return successResponse({
      user: safeUser,
      stats: {
        totalComments: user._count.comments,
        totalFavorites: user._count.favorites,
        totalPlaylists: user._count.playlists,
        totalSubscriptions: user._count.subscriptions,
        totalWatched: user._count.watchHistory
      },
      lastActivity
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur récupération utilisateur.', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const admin = await requireAdmin(request)
    // replaced params destructuring

    if (admin.id === id) {
      return errorResponse('Vous ne pouvez pas supprimer votre propre compte admin.', 400)
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return errorResponse('Utilisateur non trouvé.', 404)

    // Soft delete + Anonymisation
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        email: `deleted_${id}@anonymized.com`,
        username: `user_${id.substring(0, 8)}`,
        avatarUrl: null,
        bio: null,
        passwordHash: 'DELETED'
      }
    })

    return successResponse(null, 'Utilisateur anonymisé et désactivé.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur lors de la suppression.', 500)
  }
}
