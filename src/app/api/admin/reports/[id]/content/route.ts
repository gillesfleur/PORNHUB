import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'
import { CommentStatus, ReportStatus } from '@prisma/client'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    const reportId = id

    const report = await prisma.report.findUnique({ where: { id: reportId } })
    if (!report) return errorResponse('Signalement non trouvé.', 404)

    await prisma.$transaction(async (tx) => {
      if (report.contentType === 'VIDEO') {
        await tx.video.update({
          where: { id: report.contentId },
          data: { isActive: false }
        })
        // Invalider le cache vidéo serait bien mais ici on a l'ID, pas le slug direct dans report
        // On va invalider par pattern si on peut récupérer le slug
        const video = await tx.video.findUnique({ where: { id: report.contentId }, select: { slug: true } })
        if (video) await cacheDelPattern(`video:${video.slug}*`)
      } 
      
      else if (report.contentType === 'COMMENT') {
        const comment = await tx.comment.update({
          where: { id: report.contentId },
          data: { status: CommentStatus.DELETED, content: '[Commentaire supprimé]' },
          include: { video: { select: { slug: true } } }
        })
        await cacheDelPattern(`comments:${comment.video.slug}:*`)
      }

      // Marquer le signalement comme résolu
      await tx.report.update({
        where: { id: reportId },
        data: { 
          status: ReportStatus.RESOLVED,
          resolvedAt: new Date(),
          adminNotes: (report.adminNotes || '') + '\n[AUTO] Contenu supprimé via modération.'
        }
      })
    })

    return successResponse(null, 'Contenu modéré et signalement résolu.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[MODERATE_CONTENT_ERROR]', error)
    return errorResponse('Erreur lors de la modération du contenu.', 500)
  }
}
