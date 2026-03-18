import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { importVideosFromEporner } from '@/lib/import-service'

// État des imports en cours pour éviter les collisions
const activeImports = new Set<string>()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // replaced params destructuring
  
  if (activeImports.has(id)) {
    return errorResponse('Import déjà en cours pour cette source.', 409)
  }

  try {
    await requireAdmin(request)
    const source = await prisma.apiSource.findUnique({ where: { id } })

    if (!source) {
      return errorResponse('Source non trouvée.', 404)
    }

    const body = await request.json().catch(() => ({}))
    const { query, order, pages, perPage } = body

    activeImports.add(id)

    // L'import est lancé "async" mais on attend ici pour retourner le résultat
    // Dans un vrai prod, on pourrait retourner 202 Accepted et faire l'import en background
    const result = await importVideosFromEporner({
      sourceId: id,
      query: query || 'all',
      order: order || (source.config as any)?.defaultOrder || 'latest',
      pages: pages || (source.config as any)?.defaultPages || 1,
      perPage: perPage || (source.config as any)?.defaultPerPage || 30
    })

    return successResponse(result, 'Importation terminée')
  } catch (error: any) {
    if (error.message === 'Forbidden') return errorResponse('Accès interdit', 403)
    if (error.message === 'Unauthorized') return errorResponse('Non autorisé', 401)
    return errorResponse(error.message, 500)
  } finally {
    activeImports.delete(id)
  }
}
