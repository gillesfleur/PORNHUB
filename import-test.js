require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
// Utilisation de require sur les fichiers compilés ou avec ts-node pourrait être complexe ici
// On va simplifier le test pour isoler juste la BDD
const prisma = new PrismaClient()

async function testQuery() {
  console.log('--- Test de connexion BDD ---')
  try {
    const userCount = await prisma.user.count()
    console.log(`Utilisateurs en BDD : ${userCount}`)
    
    const source = await prisma.apiSource.upsert({
      where: { name: 'EPORNER' },
      update: {},
      create: {
        name: 'EPORNER',
        baseUrl: 'https://www.eporner.com/api/v2',
        isActive: true,
        syncFrequency: 120,
        config: { defaultOrder: 'latest', defaultPerPage: 10, defaultPages: 1 }
      }
    })
    console.log(`Source EPORNER prÃªte ID: ${source.id}`)

  } catch (e) {
    console.error('Erreur :', e)
  } finally {
    await prisma.$disconnect()
  }
}

testQuery()
