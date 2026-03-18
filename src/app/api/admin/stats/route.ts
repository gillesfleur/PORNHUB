import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { startOfToday, subDays, startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const cacheKey = 'admin:stats'
    const cached = await cacheGet(cacheKey)
    if (cached) return successResponse(cached, 'OK (Cached)')

    const now = new Date()
    const lastWeekStart = startOfWeek(now)
    const today = startOfToday()

    const [
      totalVideos,
      totalUsers,
      totalViewsAgg,
      pendingReports,
      videosThisWeek,
      usersThisWeek,
      viewsThisWeekAgg,
      topVideosToday,
      recentReports
    ] = await Promise.all([
      prisma.video.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.video.aggregate({ _sum: { viewsInternal: true } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.video.count({ where: { createdAt: { gte: lastWeekStart } } }),
      prisma.user.count({ where: { createdAt: { gte: lastWeekStart } } }),
      prisma.video.aggregate({
        where: { createdAt: { gte: lastWeekStart } },
        _sum: { viewsInternal: true }
      }),
      prisma.video.findMany({
        where: { isActive: true },
        orderBy: { viewsInternal: 'desc' },
        take: 5,
        select: { title: true, slug: true, viewsInternal: true }
      }),
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { reportType: true, contentType: true, createdAt: true, status: true }
      })
    ])

    // Daily views (last 7 days) via WatchHistory
    const dailyViews = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = subDays(today, i)
        const nextDate = subDays(today, i - 1)
        const count = await prisma.watchHistory.count({
          where: {
            watchedAt: {
              gte: date,
              lt: nextDate
            }
          }
        })
        return {
          date: date.toISOString().split('T')[0],
          views: count
        }
      })
    )

    const stats = {
      totalVideos,
      totalUsers,
      totalViews: totalViewsAgg._sum.viewsInternal || 0,
      pendingReports,
      videosThisWeek,
      usersThisWeek,
      viewsThisWeek: viewsThisWeekAgg._sum.viewsInternal || 0,
      dailyViews: dailyViews.reverse(),
      topVideosToday,
      recentReports
    }

    await cacheSet(cacheKey, stats, 300) // 5 minutes

    return successResponse(stats)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_STATS_ERROR]', error)
    return errorResponse('Erreur statistiques admin.', 500)
  }
}
