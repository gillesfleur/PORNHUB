import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { cacheDelPattern } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const body = await request.json()
    const { sourceTagIds, targetTagId } = body as { sourceTagIds: string[], targetTagId: string }

    if (!sourceTagIds || !targetTagId || !Array.isArray(sourceTagIds)) {
      return errorResponse('Paramètres invalides.', 400)
    }

    // Transaction pour garantir l'intégrité
    await prisma.$transaction(async (tx) => {
      for (const sourceId of sourceTagIds) {
        if (sourceId === targetTagId) continue

        // 1. Trouver toutes les relations video_tags de la source
        const relationships = await tx.videoTag.findMany({
          where: { tagId: sourceId }
        })

        for (const rel of relationships) {
          // 2. Vérifier si la vidéo a déjà le tag cible
          const exists = await tx.videoTag.findUnique({
            where: {
              videoId_tagId: { videoId: rel.videoId, tagId: targetTagId }
            }
          })

          if (!exists) {
            // Relocaliser vers le target
            await tx.videoTag.create({
              data: { videoId: rel.videoId, tagId: targetTagId }
            })
          }
          
          // 3. Supprimer l'ancienne relation
          await tx.videoTag.delete({ where: { videoId_tagId: { videoId: rel.videoId, tagId: rel.tagId } } })
        }

        // 4. Supprimer le tag source
        await tx.tag.delete({ where: { id: sourceId } })
      }

      // 5. Recalculer le videoCount du target
      const count = await tx.videoTag.count({ where: { tagId: targetTagId } })
      await tx.tag.update({
        where: { id: targetTagId },
        data: { videoCount: count }
      })
    })

    await cacheDelPattern('tags:*')
    await cacheDelPattern('tag:*')
    
    return successResponse(null, 'Fusion des tags réussie.')
  } catch (error: any) {
    console.error('[TAG_MERGE_ERROR]', error)
    return errorResponse(error.message, 500)
  }
}
