import { Video, Quality } from '@prisma/client'

// --- INTERFACES ---

export interface EpornerThumb {
  src: string
  width: number
  height: number
}

export interface EpornerVideo {
  id: string
  title: string
  keywords: string
  views: number
  rate: number
  url: string
  added: string
  length_sec: number
  length_min: string
  embed: string
  default_thumb: EpornerThumb
  thumbs: EpornerThumb[]
}

export interface EpornerSearchResponse {
  from: number
  to: number
  per_page: number
  total_count: number
  total_pages: number
  videos: EpornerVideo[]
}

// --- UTILS ---

/**
 * Convertit un titre en slug URL-friendly
 */
export function slugify(text: string): string {
  const slug = text
    .toString()
    .normalize('NFD') // Sépare les accents des lettres
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/[^\w-]+/g, '') // Supprime tout ce qui n'est pas lettre, chiffre ou tiret
    .replace(/--+/g, '-') // Supprime les doubles tirets

  const randomSuffix = Math.random().toString(36).substring(2, 5)
  return `${slug}-${randomSuffix}`
}

/**
 * Mappe les données EPORNER vers notre schéma Prisma Video
 */
export function mapEpornerToVideo(epornerVideo: EpornerVideo): Partial<Video> {
  // Déterminer la qualité (par défaut HD pour Eporner v2)
  let quality: Quality = 'HD'
  if (epornerVideo.title.toLowerCase().includes('4k') || epornerVideo.title.toLowerCase().includes('uhd')) {
    quality = 'UHD'
  } else if (epornerVideo.title.toLowerCase().includes('1080p') || epornerVideo.title.toLowerCase().includes('fhd')) {
    quality = 'FHD'
  }

  return {
    externalId: epornerVideo.id,
    source: 'EPORNER',
    title: epornerVideo.title,
    slug: slugify(epornerVideo.title),
    description: `Video sourced from Eporner: ${epornerVideo.title}`,
    duration: parseInt(epornerVideo.length_sec.toString(), 10),
    durationFormatted: epornerVideo.length_min,
    viewsExternal: parseInt(epornerVideo.views.toString(), 10),
    rating: parseFloat(epornerVideo.rate.toString()),
    thumbnailUrl: epornerVideo.default_thumb.src,
    embedUrl: epornerVideo.embed,
    videoUrl: epornerVideo.url,
    quality: quality,
    publishedAt: new Date(epornerVideo.added),
    isActive: true,
  }
}

// --- API CLIENT ---

const BASE_URL = 'https://www.eporner.com/api/v2'

export async function searchVideos(params: {
  query?: string
  page?: number
  perPage?: number
  order?: 'latest' | 'longest' | 'shortest' | 'top-rated' | 'most-popular' | 'top-weekly' | 'top-monthly'
  thumbsize?: 'small' | 'medium' | 'big' | 'big_3x'
}): Promise<EpornerSearchResponse> {
  const {
    query = 'all',
    page = 1,
    perPage = 30,
    order = 'latest',
    thumbsize = 'big',
  } = params

  const url = new URL(`${BASE_URL}/video/search/`)
  url.searchParams.append('query', query)
  url.searchParams.append('page', page.toString())
  url.searchParams.append('per_page', perPage.toString())
  url.searchParams.append('order', order)
  url.searchParams.append('thumbsize', thumbsize)
  url.searchParams.append('format', 'json')

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache Next.js (1h)
      signal: AbortSignal.timeout(10000), // Timeout 10s
    })

    if (!response.ok) {
      throw new Error(`Eporner API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[EPORNER_SEARCH_ERROR]', error)
    throw error
  }
}

export async function getVideoById(externalId: string): Promise<EpornerVideo | null> {
  const url = new URL(`${BASE_URL}/video/id/`)
  url.searchParams.append('id', externalId)
  url.searchParams.append('thumbsize', 'big')
  url.searchParams.append('format', 'json')

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Eporner API responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('[EPORNER_GET_BY_ID_ERROR]', error)
    return null
  }
}
