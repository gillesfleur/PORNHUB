import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { CommentStatus, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '50'))
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Prisma.CommentWhereInput = {}

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as CommentStatus
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { user: { username: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [total, comments] = await Promise.all([
      prisma.comment.count({ where }),
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: { select: { id: true, username: true, avatarUrl: true, email: true } },
          video: { select: { title: true, slug: true } },
        }
      })
    ])

    // Récupérer les reportCounts
    const reportCounts = await prisma.report.groupBy({
      by: ['contentId'],
      where: { 
        contentType: 'COMMENT', 
        contentId: { in: (comments as any[]).map(c => c.id) } 
      },
      _count: true
    })

    const reportMap = Object.fromEntries(
      reportCounts.map((r: any) => [r.contentId, r._count])
    )

    const formatted = (comments as any[]).map(c => ({
      ...c,
      reportCount: reportMap[c.id] || 0
    }))

    return successResponse({
      comments: formatted,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur admin commentaires.', 500)
  }
}
