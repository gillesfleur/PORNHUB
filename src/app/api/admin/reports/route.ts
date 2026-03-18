import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ReportStatus, ReportType, Priority, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '50'))
    
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')

    const where: Prisma.ReportWhereInput = {}

    if (status && status !== 'all') where.status = status.toUpperCase() as ReportStatus
    if (type && type !== 'all') where.reportType = type.toUpperCase() as ReportType
    if (priority && priority !== 'all') where.priority = priority.toUpperCase() as Priority

    const [total, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          assignedTo: { select: { id: true, username: true } }
        }
      })
    ])

    return successResponse({
      reports,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[GET_REPORTS_ERROR]', error)
    return errorResponse('Erreur admin signalements.', 500)
  }
}
