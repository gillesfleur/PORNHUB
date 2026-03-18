import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '20'))
    const search = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, featured, reported
    const source = searchParams.get('source')

    const where: Prisma.VideoWhereInput = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { externalId: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status === 'active') where.isActive = true
    else if (status === 'inactive') where.isActive = false
    else if (status === 'featured') where.isFeatured = true
    // reported logic: handled below via a set of IDs if needed, or we can filter by reports relation if it existed
    // Since Report uses contentId as String, we might need a separate query for 'reported' status filter

    if (source) where.source = source

    // Handle 'reported' filter if requested
    if (status === 'reported') {
      const reportedVideoIds = await prisma.report.findMany({
        where: { contentType: 'VIDEO', status: 'PENDING' },
        select: { contentId: true }
      })
      const ids = Array.from(new Set(reportedVideoIds.map(r => r.contentId)))
      where.id = { in: ids }
    }

    const [total, videos] = await Promise.all([
      prisma.video.count({ where }),
      prisma.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { comments: true } }
        }
      })
    ])

    // Get report counts for these videos
    const reportCounts = await prisma.report.groupBy({
      by: ['contentId'],
      where: { 
        contentType: 'VIDEO', 
        contentId: { in: videos.map(v => v.id) } 
      },
      _count: true
    })

    const reportMap = Object.fromEntries(
      reportCounts.map(r => [r.contentId, r._count])
    )

    const formatted = videos.map(v => ({
      ...v,
      reportCount: reportMap[v.id] || 0
    }))

    return successResponse({
      videos: formatted,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_VIDEOS_GET_ERROR]', error)
    return errorResponse('Erreur récupération des vidéos.', 500)
  }
}
