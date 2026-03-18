import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // replaced params destructuring
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')

  try {
    await requireAdmin(request)
    
    const [total, logs] = await Promise.all([
      prisma.importLog.count({ where: { sourceId: id } }),
      prisma.importLog.findMany({
        where: { sourceId: id },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      })
    ])

    return paginatedResponse(logs, page, pageSize, total)
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  }
}
