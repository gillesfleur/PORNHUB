import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return successResponse(categories)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { name, slug, description, imageUrl, isActive } = body

    if (!name || !slug) return errorResponse('Nom et Slug requis', 400)

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    await cacheDelPattern('categories:*')
    return successResponse(category, 'Catégorie créée', 201)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
