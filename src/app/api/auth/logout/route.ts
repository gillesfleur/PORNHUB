import { NextResponse } from 'next/server'
import { successResponse } from '@/lib/api-response'

export async function POST() {
  // Le logout se fait principalement côté client en supprimant les tokens.
  // Cet endpoint est là pour la forme ou pour une future blacklist.
  return successResponse(null, 'Déconnexion réussie')
}
