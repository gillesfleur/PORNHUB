import { NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { searchVideos } from '@/lib/eporner'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAdmin(request)
    
    // Test simple : 1 vidéo, 1 page
    const data = await searchVideos({ perPage: 1, page: 1 })
    
    if (data && data.videos && data.videos.length > 0) {
      return successResponse({
        success: true,
        message: 'Connexion réussie',
        sampleVideo: {
          id: data.videos[0].id,
          title: data.videos[0].title
        }
      })
    }

    return errorResponse('Connexion réussie mais aucun résultat retourné.', 200)
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return successResponse({
      success: false,
      message: 'Erreur de connexion',
      error: error.message
    })
  }
}
