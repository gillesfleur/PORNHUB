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

  try {
    await requireAdmin(request)
    // replaced params destructuring
    const body = await request.json()
    const { 
      title, description, categoryId, quality, 
      isFeatured, isActive, tags 
    } = body

    // 1. Update Video metadata
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (quality !== undefined) updateData.quality = quality
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isActive !== undefined) updateData.isActive = isActive

    const video = await prisma.video.update({
      where: { id },
      data: updateData
    })

    // 2. Update Tags if provided
    if (tags && Array.isArray(tags)) {
      // Clear existing tags
      await prisma.videoTag.deleteMany({ where: { videoId: id } })
      
      // Add new tags (finding or creating tags first)
      if (tags.length > 0) {
        // Tag management logic: for now assume tags are IDs or we need to resolve slugs
        // Simplification for prototype: 'tags' is a list of tag names/slugs
        for (const tagSlug of tags) {
          const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } })
          if (tag) {
            await prisma.videoTag.create({
              data: { videoId: id, tagId: tag.id }
            })
          }
        }
      }
    }

    await cacheDelPattern(`videos:detail:${video.slug}*`)
    await cacheDelPattern('videos:list:*')
    await cacheDelPattern('videos:popular:*')

    return successResponse(video, 'Vidéo mise à jour.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_VIDEO_PUT_ERROR]', error)
    return errorResponse('Erreur mise à jour vidéo.', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    // replaced params destructuring

    const video = await prisma.video.findUnique({ where: { id }, select: { slug: true } })
    if (!video) return errorResponse('Vidéo non trouvée.', 404)

    // Hard delete - Prisma handles cascades if onDelete: Cascade is in schema
    await prisma.video.delete({ where: { id } })

    await cacheDelPattern(`videos:detail:${video.slug}*`)
    await cacheDelPattern('videos:list:*')
    await cacheDelPattern('videos:popular:*')

    return successResponse(null, 'Vidéo supprimée définitivement.')
  } catch (error: any) {
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    console.error('[ADMIN_VIDEO_DELETE_ERROR]', error)
    return errorResponse('Erreur suppression vidéo.', 500)
  }
}
