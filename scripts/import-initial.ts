import { importVideosFromEporner } from '../src/lib/import-service'
import { prisma } from '../src/lib/prisma'

async function run() {
  console.log('--- Lancement d’un import initial (50 vidéos)... ---')
  
  try {
    const source = await prisma.apiSource.findFirst({ where: { name: 'EPORNER' } })
    if (!source) {
      console.error('Source EPORNER non trouvée. Veuillez exécuter "npx prisma db seed" d’abord.')
      process.exit(1)
    }

    const result = await importVideosFromEporner({
      sourceId: source.id,
      pages: 1,
      perPage: 50,
      order: 'latest'
    })
    
    console.log('✅ Import terminé !')
    console.log(`- Importées : ${result.imported}`)
    console.log(`- Erreurs : ${result.errors}`)
    
    if (result.errorDetails.length > 0) {
      console.log('Détails des premières erreurs :')
      console.log(JSON.stringify(result.errorDetails.slice(0, 5), null, 2))
    }
  } catch (error: any) {
    console.error('❌ ERREUR CRITIQUE :', error.message)
    if (error.stack) console.error(error.stack)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

run()
