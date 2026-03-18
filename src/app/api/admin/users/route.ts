import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { Prisma, UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '20'))
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const status = searchParams.get('status') // active, suspended

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role && Object.values(UserRole).includes(role.toUpperCase() as UserRole)) {
      where.role = role.toUpperCase() as UserRole
    }

    if (status === 'active') where.isActive = true
    else if (status === 'suspended') where.isActive = false

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              comments: true,
              favorites: true,
              playlists: true
            }
          }
        }
      })
    ])

    const formattedUsers = users.map(user => ({
      ...user,
      commentCount: user._count.comments,
      favoriteCount: user._count.favorites,
      playlistCount: user._count.playlists,
      _count: undefined
    }))

    return successResponse({
      users: formattedUsers,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_USERS_GET_ERROR]', error)
    return errorResponse('Erreur récupération des utilisateurs.', 500)
  }
}
