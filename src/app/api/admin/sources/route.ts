import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const sources = await prisma.apiSource.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return successResponse(sources)
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { name, baseUrl, apiKey, syncFrequency, config, isActive } = body

    if (!name || !baseUrl) {
      return errorResponse('Le nom et l\'URL de base sont requis.', 400)
    }

    const source = await prisma.apiSource.create({
      data: {
        name,
        baseUrl,
        apiKey,
        syncFrequency: parseInt(syncFrequency) || 120,
        config: config || {},
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return successResponse(source, 'Source créée avec succès', 201)
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  }
}
