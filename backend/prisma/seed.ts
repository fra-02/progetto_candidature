/**
 * @file seed.ts
 * @description
 * Script di seeding potenziato per popolare il database con dati di test realistici.
 * Usa Faker.js per generare 25 candidati unici con dati, stati e tag casuali.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// --- Dati di Configurazione per il Seeding ---

const USERS = [
  { username: 'admin', password: 'password123' },
  { username: 'recruiter', password: 'password123' },
];

const TAGS = [
  "React", "Vue", "Angular", "TypeScript", "JavaScript", "Node.js", "Python", 
  "PHP", "Go", "NestJS", "FastAPI", "PostgreSQL", "MySQL", "MongoDB", "Redis", 
  "Docker", "Kubernetes", "AWS", "Nginx", "GitHub Actions", "Project Management", 
  "Agile", "UI/UX", "Data Science"
];

const STATUSES: ('pending' | 'reviewed' | 'rejected')[] = ['pending', 'reviewed', 'rejected'];

// --- Funzione Principale di Seeding ---

async function main() {
  console.log('Seeding started...');

  // --- 1. Pulizia e Setup Iniziale ---
  console.log('Cleaning up old data...');
  await prisma.review.deleteMany();
  await prisma.candidate.deleteMany();
  
  // --- 2. Seeding degli Utenti ---
  console.log('Seeding users...');
  const createdUsers = await Promise.all(
    USERS.map(user => prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: {
        username: user.username,
        passwordHash: bcrypt.hashSync(user.password, 10),
      },
    }))
  );
  console.log(`${createdUsers.length} users created/updated.`);

  // --- 3. Seeding dei Tag ---
  console.log('Seeding tags...');
  const createdTags = await Promise.all(
    TAGS.map(tagName => prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    }))
  );
  console.log(`${createdTags.length} tags created/updated.`);

  // --- 4. Generazione Programmatica di 25 Candidati ---
  console.log('Generating 25 candidates...');
  for (let i = 0; i < 25; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName, provider: 'example.com' });
    const status = faker.helpers.arrayElement(STATUSES);
    const randomTags = faker.helpers.arrayElements(createdTags, { min: 2, max: 6 });

    const candidate = await prisma.candidate.create({
      data: {
        uuid: faker.string.uuid(),
        sender: faker.phone.number(),
        status,
        fullName,
        email,
        githubLink: `github.com/${faker.internet.userName({ firstName, lastName })}`,
        rawAnswers: { "screen_0_TextInput_0": fullName, "screen_0_TextInput_1": email },
        // CORREZIONE: Usa la sintassi 'connect' per la relazione M-N
        tags: {
          connect: randomTags.map(tag => ({ id: tag.id })),
        },
      },
    });

    if (status !== 'pending') {
      await prisma.review.create({
        data: {
          phase: 1,
          // CORREZIONE: Usa 'fractionDigits' invece di 'precision'
          grade: faker.number.float({ min: 4, max: 10, fractionDigits: 1 }),
          notes: faker.lorem.sentence(),
          candidateId: candidate.id,
          userId: faker.helpers.arrayElement(createdUsers).id,
        },
      });

      if (status === 'reviewed' && Math.random() > 0.5) {
        await prisma.review.create({
          data: {
            phase: 2,
            // CORREZIONE: Usa 'fractionDigits' invece di 'precision'
            grade: faker.number.float({ min: 6, max: 10, fractionDigits: 1 }),
            notes: faker.lorem.sentence(),
            candidateId: candidate.id,
            userId: faker.helpers.arrayElement(createdUsers).id,
          },
        });
      }
    }
  }
  console.log('25 candidates created successfully.');
  console.log('Seeding finished.');
}


// --- Esecuzione dello Script ---
main()
  .catch((e) => {
    console.error("An error occurred during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });