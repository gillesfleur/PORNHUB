import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheGet, cacheSet } from '@/lib/redis'
import { getCurrentUser } from '@/lib/auth'
import { CommentStatus } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // replaced params destructuring
  const { searchParams } = new URL(request.url)
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const perPage = Math.min(100, parseInt(searchParams.get('perPage') || '20'))
  const sort = searchParams.get('sort') || 'recent'

  const user = await getCurrentUser(request)
  
  // Cache key (unique par user s'il est co pour hasVoted, ou public)
  const cacheKey = `comments:${slug}:${sort}:${page}:${perPage}:${user?.id || 'public'}`
  const cached = await cacheGet(cacheKey)
  if (cached) return successResponse(cached, 'OK (Cached)')

  try {
    const video = await prisma.video.findUnique({ where: { slug }, select: { id: true } })
    if (!video) return errorResponse('Vidéo non trouvée', 404)

    // Tri
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'popular') orderBy = { likes: 'desc' }
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' }

    // On récupère uniquement les commentaires racines (parentId: null)
    const [total, rootComments] = await Promise.all([
      prisma.comment.count({
        where: { videoId: video.id, parentId: null, status: CommentStatus.PUBLISHED }
      }),
      prisma.comment.findMany({
        where: { videoId: video.id, parentId: null, status: CommentStatus.PUBLISHED },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          replies: {
            where: { status: CommentStatus.PUBLISHED },
            include: {
              user: { select: { id: true, username: true, avatarUrl: true } },
              votes: user ? { where: { userId: user.id }, select: { voteType: true } } : false
            },
            orderBy: { createdAt: 'asc' },
            take: 5 // On limite les premières réponses affichées
          },
          votes: user ? { where: { userId: user.id }, select: { voteType: true } } : false,
          _count: { select: { replies: { where: { status: CommentStatus.PUBLISHED } } } }
        },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage
      })
    ])

    // Formater la réponse pour inclure hasVoted
    const formattedComments = rootComments.map((comment: any) => {
      const hasVoted = (comment.votes && comment.votes.length > 0) ? comment.votes[0].voteType.toLowerCase() : null
      
      return {
        id: comment.id,
        content: comment.content,
        likes: comment.likes,
        dislikes: comment.dislikes,
        createdAt: comment.createdAt,
        user: comment.user,
        replyCount: comment._count.replies,
        hasVoted,
        replies: comment.replies.map((reply: any) => ({
          id: reply.id,
          content: reply.content,
          likes: reply.likes,
          dislikes: reply.dislikes,
          createdAt: reply.createdAt,
          user: reply.user,
          hasVoted: (reply.votes && reply.votes.length > 0) ? reply.votes[0].voteType.toLowerCase() : null
        }))
      }
    })

    const payload = {
      comments: formattedComments,
      pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) }
    }

    await cacheSet(cacheKey, payload, 60) // 1 minute

    return successResponse(payload)
  } catch (error) {
    console.error('[GET_COMMENTS_ERROR]', error)
    return errorResponse('Erreur lors de la récupération des commentaires.', 500)
  }
}
