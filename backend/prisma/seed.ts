// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  
  const passwordHash = bcrypt.hashSync('password123', 10);

  // Usa 'upsert' per creare l'utente admin solo se non esiste già
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' }, // Criterio per trovare l'utente
    update: {}, // Se lo trovi, non fare nulla (o aggiorna la password se vuoi)
    create: {   // Se non lo trovi, crealo con questi dati
      username: 'admin',
      passwordHash: passwordHash,
    },
  });

  console.log(`Admin user '${adminUser.username}' is available.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });