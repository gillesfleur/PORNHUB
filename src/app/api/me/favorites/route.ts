import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '24'))
    const sort = searchParams.get('sort') || 'recent'

    // Tri
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'title') orderBy = { video: { title: 'asc' } }
    else if (sort === 'popular') orderBy = { video: { viewsInternal: 'desc' } }

    const [total, favorites] = await Promise.all([
      prisma.favorite.count({ where: { userId: user.id } }),
      prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          video: {
            include: {
              category: { select: { name: true, slug: true } }
            }
          }
        }
      })
    ])

    const result = {
      favorites: favorites.map(f => f.video),
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    return successResponse(result)
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur favoris.', 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    await prisma.favorite.deleteMany({
      where: { userId: user.id }
    })

    return successResponse(null, 'Tous les favoris ont été supprimés.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse('Erreur suppression favoris.', 500)
  }
}
