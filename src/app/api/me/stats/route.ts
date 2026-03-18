import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const [
      watchedStats,
      favoritesCount,
      playlistsCount,
      commentsCount,
      subscriptionsCount,
      recentFavorites,
      recentHistory
    ] = await Promise.all([
      prisma.watchHistory.aggregate({
        where: { userId: user.id },
        _count: true,
        _sum: { watchDuration: true }
      }),
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.playlist.count({ where: { userId: user.id } }),
      prisma.comment.count({ where: { userId: user.id } }),
      prisma.subscription.count({ where: { userId: user.id } }),
      // Récupérer les 5 derniers favoris
      prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { video: { select: { title: true, slug: true, thumbnailUrl: true } } }
      }),
      // Récupérer les 5 dernières vidéos vues
      prisma.watchHistory.findMany({
        where: { userId: user.id },
        orderBy: { watchedAt: 'desc' },
        take: 5,
        include: { video: { select: { title: true, slug: true, thumbnailUrl: true } } }
      })
    ])

    // Fusionner et trier l'activité récente
    const activity: any[] = [
      ...recentFavorites.map((f: any) => ({ type: 'favorite', video: f.video, date: f.createdAt })),
      ...recentHistory.map((h: any) => ({ type: 'watch', video: h.video, date: h.watchedAt }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

    const stats = {
      totalVideosWatched: watchedStats._count,
      totalWatchTime: watchedStats._sum.watchDuration || 0,
      totalFavorites: favoritesCount,
      totalPlaylists: playlistsCount,
      totalComments: commentsCount,
      totalSubscriptions: subscriptionsCount,
      memberSince: user.createdAt,
      recentActivity: activity
    }

    return successResponse(stats)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur statistiques.', 500)
  }
}
