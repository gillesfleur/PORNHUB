import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
    return successResponse(tags)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) return errorResponse('Nom et Slug requis', 400)

    const tag = await prisma.tag.create({
      data: { name, slug }
    })

    await cacheDelPattern('tags:*')
    return successResponse(tag, 'Tag créé', 201)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
