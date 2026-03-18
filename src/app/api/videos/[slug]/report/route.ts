import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateEmail } from '@/lib/validators'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring

  try {
    const body = await request.json()
    const { reporterName, reporterEmail, reportType, description, originalUrl } = body

    if (!reportType || !description) {
      return errorResponse('Type de signalement et description requis.', 400)
    }

    if (reporterEmail && !validateEmail(reporterEmail)) {
      return errorResponse('Email invalide.', 400)
    }

    const video = await prisma.video.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    await prisma.report.create({
      data: {
        contentId: video.id,
        contentType: 'VIDEO',
        reportType,
        description,
        reporterName: reporterName || 'Anonyme',
        reporterEmail: reporterEmail || null,
        status: 'PENDING'
      }
    })

    return successResponse(null, 'Signalement enregistré avec succès. Merci.')

  } catch (error: any) {
    console.error('[REPORT_ERROR]', error)
    return errorResponse('Erreur lors de l\'enregistrement du signalement.', 500)
  }
}
