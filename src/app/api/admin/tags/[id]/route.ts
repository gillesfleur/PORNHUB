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
    
    const tag = await prisma.tag.update({
      where: { id },
      data: body
    })

    await cacheDelPattern('tags:*')
    return successResponse(tag, 'Tag mis à jour')
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
    
    // On pourrait vérifier s'il reste des vidéos liées
    await prisma.tag.delete({ where: { id } })

    await cacheDelPattern('tags:*')
    return successResponse(null, 'Tag supprimé')
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
