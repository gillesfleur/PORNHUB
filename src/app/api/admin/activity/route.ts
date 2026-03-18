import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    // On récupère les 20 plus récentes actions mélangées
    // Comme il n'y a pas de table Activities globale, on fait plusieurs requêtes et on fusionne
    const [users, reports, imports] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, username: true, createdAt: true }
      }),
      prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, reportType: true, contentType: true, createdAt: true, status: true }
      }),
      prisma.importLog.findMany({
        orderBy: { startedAt: 'desc' },
        take: 20,
        include: { source: { select: { name: true } } }
      })
    ])

    const activities: any[] = [
      ...users.map(u => ({
        id: u.id,
        type: 'USER_NEW',
        label: `Nouvel utilisateur : ${u.username}`,
        date: u.createdAt
      })),
      ...reports.map(r => ({
        id: r.id,
        type: 'REPORT_NEW',
        label: `Signalement (${r.reportType}) sur ${r.contentType}`,
        date: r.createdAt,
        status: r.status
      })),
      ...imports.map(i => ({
        id: i.id,
        type: 'IMPORT_SYNC',
        label: `Import depuis ${i.source.name} : ${i.videosImported} vidéos`,
        date: i.startedAt,
        status: i.status
      }))
    ]

    // Trier tout par date desc et garder les 20 derniers
    const sortedActivity = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20)

    return successResponse(sortedActivity)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_ACTIVITY_ERROR]', error)
    return errorResponse('Erreur flux activité.', 500)
  }
}
