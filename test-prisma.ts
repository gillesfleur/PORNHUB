import { PrismaClient } from '@prisma/client';
console.log('Testing new PrismaClient()');
try {
  const p1 = new PrismaClient();
  console.log('Success empty args');
} catch(e) { console.error('Error empty args', e) }

try {
  const p2 = new PrismaClient({});
  console.log('Success empty obj');
} catch(e) { console.error('Error empty obj', e) }

try {
  const p3 = new PrismaClient({ log: ['query'] });
  console.log('Success with log array');
} catch(e) { console.error('Error log array', e) }

try {
  const p4 = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
  console.log('Success with datasources url');
} catch(e) { console.error('Error with datasources url', e) }
