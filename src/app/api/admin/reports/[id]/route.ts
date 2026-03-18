import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ReportStatus, Priority } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring

    const report = await prisma.report.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, username: true } } }
    })

    if (!report) return errorResponse('Signalement non trouvé.', 404)

    // Récupérer le contenu selon le type
    let content: any = null
    if (report.contentType === 'VIDEO') {
      content = await prisma.video.findUnique({
        where: { id: report.contentId },
        select: { id: true, title: true, slug: true, thumbnailUrl: true, isActive: true }
      })
    } else if (report.contentType === 'COMMENT') {
      content = await prisma.comment.findUnique({
        where: { id: report.contentId },
        include: { user: { select: { username: true } }, video: { select: { title: true, slug: true } } }
      })
    }

    return successResponse({ report, content })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur récupération signalement.', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring
    const body = await request.json()
    const { status, priority, adminNotes, assignedToId } = body

    const updateData: any = {}
    if (status) {
      updateData.status = status as ReportStatus
      if (status === 'RESOLVED') updateData.resolvedAt = new Date()
    }
    if (priority) updateData.priority = priority as Priority
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId

    const updated = await prisma.report.update({
      where: { id },
      data: updateData
    })

    return successResponse(updated, 'Signalement mis à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    return errorResponse('Erreur mise à jour signalement.', 500)
  }
}
