import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { importVideosFromEporner, cleanupBrokenEmbeds } from '@/lib/import-service'
import { cacheGet, cacheSet } from '@/lib/redis'

const TRENDING_CATEGORIES = ['amateur', 'milf', 'teen 18+', 'anal', 'lesbian', 'ebony', 'interracial']

export async function GET(request: NextRequest) {
  // 1. Protection par secret
  const authHeader = request.headers.get('x-cron-secret')
  if (authHeader !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const summaries = []

    // --- LOGIQUE DE NETTOYAGE HEBDOMADAIRE ---
    // On lance le cleanup si on est dimanche et qu'on ne l'a pas fait aujourd'hui
    const lastCleanupKey = 'cron:last_cleanup'
    const lastCleanup = await cacheGet(lastCleanupKey)
    if (now.getDay() === 0 && lastCleanup !== now.toDateString()) {
      const deactivatedCount = await cleanupBrokenEmbeds()
      console.log(`[CRON] Weekly cleanup done: ${deactivatedCount} videos deactivated.`)
      await cacheSet(lastCleanupKey, now.toDateString(), 86400 * 7)
    }

    // --- LOGIQUE D'IMPORT ---
    const sources = await prisma.apiSource.findMany({
      where: { isActive: true }
    })

    for (const source of sources) {
      const lastSynced = source.lastSyncedAt ? new Date(source.lastSyncedAt) : new Date(0)
      const nextSync = new Date(lastSynced.getTime() + source.syncFrequency * 1000)

      if (nextSync <= now) {
        console.log(`[CRON] Syncing source: ${source.name}`)
        
        // Détermination de la stratégie
        const strategyKey = `cron:last_strategy:${source.id}`
        const lastStrategy = await cacheGet(strategyKey) || 'none'
        
        let query = 'all'
        let order = 'latest'
        let currentStrategy = 'latest'

        const videoCount = await prisma.video.count()

        if (videoCount === 0) {
          query = 'all'
          order = 'top-rated'
          currentStrategy = 'initial-popular'
        } else if (lastStrategy === 'latest' || lastStrategy === 'initial-popular') {
          // Alternance vers catégorie
          const catIndexKey = `cron:cat_index:${source.id}`
          let catIndex = parseInt(await cacheGet(catIndexKey) || '0')
          query = TRENDING_CATEGORIES[catIndex % TRENDING_CATEGORIES.length]
          order = 'latest'
          currentStrategy = `category:${query}`
          await cacheSet(catIndexKey, (catIndex + 1).toString())
        } else {
          // Alternance vers latest
          query = 'all'
          order = 'latest'
          currentStrategy = 'latest'
        }

        try {
          const result = await importVideosFromEporner({
            sourceId: source.id,
            query,
            order,
            autoVolume: true // On laisse le service gérer le volume
          })
          
          await cacheSet(strategyKey, currentStrategy)

          summaries.push({
            source: source.name,
            strategy: currentStrategy,
            status: 'success',
            result
          })
        } catch (sourceError: any) {
          summaries.push({
            source: source.name,
            status: 'error',
            error: sourceError.message
          })
        }
      } else {
        summaries.push({
          source: source.name,
          status: 'skipped',
          nextSync: nextSync.toISOString()
        })
      }
    }

    return NextResponse.json({
      timestamp: now.toISOString(),
      processedSources: summaries.length,
      details: summaries
    })

  } catch (error: any) {
    console.error('[CRON_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
