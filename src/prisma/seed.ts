import { PrismaClient, StatutUICN } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const mammifere = await prisma.espece.upsert({
    where: { nom: 'Mammifère' },
    update: {},
    create: { nom: 'Mammifère' },
  });

  const oiseau = await prisma.espece.upsert({
    where: { nom: 'Oiseau' },
    update: {},
    create: { nom: 'Oiseau' },
  });

  const reptile = await prisma.espece.upsert({
    where: { nom: 'Reptile' },
    update: {},
    create: { nom: 'Reptile' },
  });

  const animaux = [
    {
      nom: 'Tigre',
      especeId: mammifere.id,
      statutUICN: StatutUICN.EN,
      ordre: 'Carnivora',
      famille: 'Felidae',
      genre: 'Panthera',
      imageUrl: 'https://example.com/tigre.jpg',
      description: "Grand félin d'Asie.",
    },
    {
      nom: 'Panda géant',
      especeId: mammifere.id,
      statutUICN: StatutUICN.VU,
      ordre: 'Carnivora',
      famille: 'Ursidae',
      genre: 'Ailuropoda',
      imageUrl: 'https://example.com/panda.jpg',
      description: 'Ursidé herbivore emblématique de Chine.',
    },
    {
      nom: 'Merle noir',
      especeId: oiseau.id,
      statutUICN: StatutUICN.LC,
      ordre: 'Passeriformes',
      famille: 'Turdidae',
      genre: 'Turdus',
      imageUrl: 'https://example.com/merle.jpg',
      description: 'Oiseau commun en Europe.',
    },
    {
      nom: 'Aigle royal',
      especeId: oiseau.id,
      statutUICN: StatutUICN.LC,
      ordre: 'Accipitriformes',
      famille: 'Accipitridae',
      genre: 'Aquila',
      imageUrl: 'https://example.com/aigle.jpg',
      description: "Rapace puissant présent dans l'hémisphère nord.",
    },
    {
      nom: 'Tortue verte',
      especeId: reptile.id,
      statutUICN: StatutUICN.EN,
      ordre: 'Testudines',
      famille: 'Cheloniidae',
      genre: 'Chelonia',
      imageUrl: 'https://example.com/tortue-verte.jpg',
      description: 'Grande tortue marine cosmopolite.',
    },
  ] as const;

  for (const a of animaux) {
    await prisma.animal.upsert({
      where: { nom: a.nom },
      update: {},
      create: a,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed terminé.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
