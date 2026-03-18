/**
 * EXEMPLES D'UTILISATION DU SERVICE EPORNER
 * 
 * Ce fichier montre comment utiliser les fonctions de recherche, récupération
 * et mapping pour intégrer les vidéos Eporner dans notre BDD Prisma.
 */

import { searchVideos, getVideoById, mapEpornerToVideo } from './eporner'
import { prisma } from './prisma'

async function examples() {
  // 1. Recherche de vidéos (ex: 'teen')
  console.log('--- Recherche de vidéos ---')
  const results = await searchVideos({ query: 'teen', perPage: 5 })
  console.log(`Trouvé ${results.total_count} vidéos.`)
  
  // 2. Mapping et insertion en BDD
  if (results.videos.length > 0) {
    const firstVideoData = results.videos[0]
    const prismaVideoData = mapEpornerToVideo(firstVideoData)
    
    console.log('--- Mapping vers Prisma ---')
    console.log(prismaVideoData)
    
    // Pour insérer réellement (B1.5+) :
    // await prisma.video.upsert({
    //   where: { externalId: firstVideoData.id },
    //   update: prismaVideoData,
    //   create: prismaVideoData as any
    // })
  }

  // 3. Récupération par ID spécifique
  console.log('--- Récupération par ID ---')
  const video = await getVideoById('12345') // Remplace par un vrai ID
  if (video) {
    console.log(`Titre : ${video.title}`)
  } else {
    console.log('Vidéo non trouvée.')
  }
}

// Pour tester manuellement :
// examples().catch(console.error)
