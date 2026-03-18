import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Routes statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    // Top 1000 Vidéos
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { viewsInternal: 'desc' },
      take: 1000
    })
    const videoRoutes = videos.map((v) => ({
      url: `${baseUrl}/videos/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))

    // Catégories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    })
    const categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6
    }))

    // Acteurs
    const actors = await prisma.actor.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    })
    const actorRoutes = actors.map((a) => ({
      url: `${baseUrl}/actors/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5
    }))

    return [...staticRoutes, ...videoRoutes, ...categoryRoutes, ...actorRoutes]
  } catch (error) {
    console.error('[SITEMAP_ERROR]', error)
    return staticRoutes
  }
}
