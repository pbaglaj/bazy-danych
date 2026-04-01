const { faker } = require('@faker-js/faker');
const prisma = require('../db/prisma');

const POWERS = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
const HERO_STATUSES = ['available', 'busy', 'retired'];
const INCIDENT_LEVELS = ['low', 'medium', 'critical'];
const INCIDENT_STATUSES = ['open', 'assigned', 'resolved'];
const CATEGORY_NAMES = ['flood', 'fire', 'robbery', 'terrorism', 'accident'];

const pick = (arr) => faker.helpers.arrayElement(arr);

async function main() {
  faker.seed(7);

  await prisma.incidentCategory.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.createMany({
    data: CATEGORY_NAMES.map((name) => ({ name })),
  });

  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });

  const heroesToCreate = Array.from({ length: 20 }, () => ({
    name: `${faker.person.fullName()} ${faker.string.uuid().slice(0, 6)}`,
    power: pick(POWERS),
    status: pick(HERO_STATUSES),
    missionsCount: faker.number.int({ min: 0, max: 50 }),
  }));

  await prisma.hero.createMany({ data: heroesToCreate });
  const heroes = await prisma.hero.findMany({ orderBy: { id: 'asc' } });

  for (let i = 0; i < 60; i += 1) {
    const status = pick(INCIDENT_STATUSES);
    const hero = status === 'open' ? null : heroes[faker.number.int({ min: 0, max: heroes.length - 1 })];
    const categoryCount = faker.number.int({ min: 1, max: 3 });
    const categoryIds = faker.helpers.arrayElements(
      categories.map((c) => c.id),
      categoryCount
    );

    const assignedAt = status === 'open' ? null : faker.date.recent({ days: 10 });
    const resolvedAt = status === 'resolved'
      ? faker.date.soon({ days: 2, refDate: assignedAt || new Date() })
      : null;

    await prisma.incident.create({
      data: {
        location: faker.location.streetAddress(),
        district: faker.location.county(),
        level: pick(INCIDENT_LEVELS),
        status,
        heroId: hero ? hero.id : null,
        assignedAt,
        resolvedAt,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
