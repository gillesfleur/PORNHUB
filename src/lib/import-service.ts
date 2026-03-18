import { prisma } from './prisma'
import { searchVideos, mapEpornerToVideo, EpornerVideo } from './eporner'
import { Category, Tag, Video, Quality } from '@prisma/client'

export type ImportResult = {
  imported: number
  updated: number
  skipped: number
  errors: number
  errorDetails: Array<{ videoId: string; error: string }>
}

const CATEGORY_MAPPING: Record<string, string> = {
  amateur: 'Amateur',
  anal: 'Anal',
  asian: 'Asian',
  bbw: 'BBW',
  'big tits': 'Big Tits',
  blonde: 'Blonde',
  brunette: 'Brunette',
  creampie: 'Creampie',
  ebony: 'Ebony',
  lesbian: 'Lesbian',
  milf: 'MILF',
  teen: 'Teen (18+)',
  threesome: 'Threesome',
  pov: 'POV',
  interracial: 'Interracial',
  hardcore: 'Hardcore',
}

/**
 * Analyse les mots-clés EPORNER pour déterminer la catégorie principale.
 */
export async function assignCategory(keywords: string): Promise<Category> {
  const kwLower = keywords.toLowerCase()
  let categoryName = 'Autre'

  for (const [key, name] of Object.entries(CATEGORY_MAPPING)) {
    if (kwLower.includes(key)) {
      categoryName = name
      break
    }
  }

  let category = await prisma.category.findFirst({ where: { name: categoryName } })
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        isActive: true,
      },
    })
  }
  return category
}

/**
 * Process les tags depuis les mots-clés.
 */
export async function processTagsFromKeywords(keywords: string): Promise<Tag[]> {
  const tags = keywords.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
  const tagObjects: Tag[] = []

  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    if (!slug) continue
    
    let tag = await prisma.tag.findFirst({ where: { name: tagName } })
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug: slug,
        },
      })
    }
    tagObjects.push(tag)
  }

  return tagObjects
}

/**
 * Orchestre l'import des vidéos depuis Eporner.
 */
export async function importVideosFromEporner(params: {
  query?: string
  order?: string
  pages?: number
  perPage?: number
  sourceId: string
  autoVolume?: boolean
}): Promise<ImportResult> {
  let { query = 'all', order = 'latest', pages = 1, perPage = 30, sourceId, autoVolume = false } = params

  if (autoVolume) {
    const totalVideos = await prisma.video.count()
    if (totalVideos < 100) {
      pages = 5
      perPage = 50
    } else if (totalVideos < 1000) {
      pages = 2
      perPage = 30
    } else {
      pages = 1
      perPage = 30
    }
  }
  
  const result: ImportResult = {
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    errorDetails: [],
  }

  const startTime = new Date()
  const categoryIds = new Set<string>()
  const tagIds = new Set<string>()

  try {
    for (let p = 1; p <= pages; p++) {
      console.log(`[IMPORT] Fetching page ${p}...`)
      const searchRes = await searchVideos({ query, page: p, perPage, order: order as any })

      for (const eVideo of searchRes.videos) {
        try {
          // 1. Vérifier si existe déjà
          const existing = await prisma.video.findFirst({
            where: { externalId: eVideo.id, source: 'EPORNER' },
          })

          if (existing) {
            // Mise à jour rapide (stats)
            await prisma.video.update({
              where: { id: existing.id },
              data: {
                viewsExternal: eVideo.views,
                rating: eVideo.rate,
              },
            })
            result.updated++
            continue
          }

          // 2. Nouvelle vidéo - Mapping
          const videoData = mapEpornerToVideo(eVideo)
          
          // 3. Catégorie
          const category = await assignCategory(eVideo.keywords)
          categoryIds.add(category.id)

          // 4. Tags
          const tags = await processTagsFromKeywords(eVideo.keywords)
          tags.forEach(t => tagIds.add(t.id))

          // 5. Création
          await prisma.video.create({
            data: {
              ...(videoData as any),
              categoryId: category.id,
              tags: {
                create: tags.map(t => ({ tagId: t.id }))
              }
            }
          })

          result.imported++
          
          // Rate limit poli
          await new Promise(resolve => setTimeout(resolve, 200))

        } catch (vError: any) {
          result.errors++
          result.errorDetails.push({ videoId: eVideo.id, error: vError.message })
          console.error(`[IMPORT_VIDEO_ERROR] ID ${eVideo.id}:`, vError)
        }
      }
    }

    // --- FIN D'IMPORT ---

    // 6. Log de l'import
    await prisma.importLog.create({
      data: {
        sourceId,
        status: 'COMPLETED',
        videosImported: result.imported,
        videosUpdated: result.updated,
        videosSkipped: result.skipped,
        errors: result.errors,
        errorDetails: result.errorDetails.slice(0, 20) as any,
        completedAt: new Date()
      }
    })

    // 7. Mettre à jour l'ApiSource
    await prisma.apiSource.update({
      where: { id: sourceId },
      data: {
        lastSyncedAt: new Date(),
        totalVideosSynced: { increment: result.imported }
      }
    })

    // 8. Recalculer les compteurs (Optionnel mais recommandé)
    // Ici on pourrait lancer une fonction d'update des stats globales.

  } catch (error: any) {
    console.error('[IMPORT_CRITICAL_ERROR]', error)
    await prisma.importLog.create({
      data: {
        sourceId,
        status: 'FAILED',
        videosImported: result.imported,
        videosUpdated: result.updated,
        videosSkipped: result.skipped,
        errors: result.errors,
        errorDetails: [{ error: error.message }] as any,
        completedAt: new Date()
      }
    })
    throw error
  }

  return result
}

/**
 * Vérifie si l'URL d'embed est toujours fonctionnelle.
 */
export async function verifyEmbedUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 } as any)
    return response.status === 200
  } catch (error) {
    return false
  }
}

/**
 * Désactive les vidéos dont l'embed est cassé.
 */
export async function cleanupBrokenEmbeds(): Promise<number> {
  const videos = await prisma.video.findMany({
    where: { isActive: true },
    select: { id: true, embedUrl: true },
    take: 500 // On traite par lots
  })

  let deactivated = 0
  for (const video of videos) {
    if (video.embedUrl) {
      const isOk = await verifyEmbedUrl(video.embedUrl)
      if (!isOk) {
        await prisma.video.update({
          where: { id: video.id },
          data: { isActive: false }
        })
        deactivated++
      }
    }
  }
  return deactivated
}
