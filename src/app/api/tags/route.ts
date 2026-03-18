import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'alpha' // popular | alpha

  const cacheKey = `tags:all:${JSON.stringify({ search, sort })}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const where: Prisma.TagWhereInput = {}
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    const orderBy: Prisma.TagOrderByWithRelationInput = sort === 'popular' 
      ? { videoCount: 'desc' } 
      : { name: 'asc' }

    const tags = await prisma.tag.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        slug: true,
        videoCount: true
      }
    })

    await cacheSet(cacheKey, tags, 1800) // 30 mins

    return successResponse(tags)
  } catch (error: any) {
    return errorResponse('Erreur tags.', 500)
  }
}
