import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { format, isToday, isYesterday, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '30'))

    const [total, history] = await Promise.all([
      prisma.watchHistory.count({ where: { userId: user.id } }),
      prisma.watchHistory.findMany({
        where: { userId: user.id },
        orderBy: { watchedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          video: {
            include: {
              category: { select: { name: true, slug: true } }
            }
          }
        }
      })
    ])

    // Groupement par date
    const groups: any[] = []
    const groupMap = new Map<string, any>()

    history.forEach((entry) => {
      const dateKey = format(startOfDay(entry.watchedAt), 'yyyy-MM-dd')
      
      if (!groupMap.has(dateKey)) {
        let label = format(entry.watchedAt, 'd MMMM yyyy', { locale: fr })
        if (isToday(entry.watchedAt)) label = "Aujourd'hui"
        else if (isYesterday(entry.watchedAt)) label = "Hier"

        const newGroup = { date: dateKey, label, videos: [] }
        groupMap.set(dateKey, newGroup)
        groups.push(newGroup)
      }

      groupMap.get(dateKey).videos.push({
        ...entry.video,
        watchedAt: entry.watchedAt,
        watchDuration: entry.watchDuration,
        historyId: entry.id
      })
    })

    return successResponse({
      groups,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur historique.', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    await prisma.watchHistory.deleteMany({
      where: { userId: user.id }
    })

    return successResponse(null, 'Tout l\'historique a été supprimé.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur suppression historique.', 500)
  }
}
