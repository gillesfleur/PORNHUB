import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // replaced params destructuring
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { name, baseUrl, apiKey, syncFrequency, config, isActive } = body

    const source = await prisma.apiSource.update({
      where: { id },
      data: {
        name,
        baseUrl,
        apiKey,
        syncFrequency: syncFrequency !== undefined ? parseInt(syncFrequency) : undefined,
        config: config || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    })

    return successResponse(source, 'Source mise à jour')
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  }
}
