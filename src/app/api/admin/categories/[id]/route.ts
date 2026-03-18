import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

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
    
    const category = await prisma.category.update({
      where: { id },
      data: body
    })

    await cacheDelPattern('categories:*')
    return successResponse(category, 'Catégorie mise à jour')
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // replaced params destructuring
  try {
    await requireAdmin(request)
    const category = await prisma.category.update({
      where: { id },
      data: { isActive: false }
    })

    await cacheDelPattern('categories:*')
    return successResponse(category, 'Catégorie désactivée')
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
