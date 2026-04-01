const prisma = require('../db/prisma');

async function main() {
  await prisma.incidentCategory.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.createMany({
    data: [
      { id: 1, name: 'flood' },
      { id: 2, name: 'fire' },
      { id: 3, name: 'robbery' },
      { id: 4, name: 'terrorism' },
      { id: 5, name: 'accident' },
    ],
  });

  await prisma.hero.createMany({
    data: [
      { id: 1, name: 'Atlas Guard', power: 'strength', status: 'available', missionsCount: 3 },
      { id: 2, name: 'Sky Arrow', power: 'flight', status: 'busy', missionsCount: 11 },
      { id: 3, name: 'Mind Lynx', power: 'telepathy', status: 'retired', missionsCount: 20 },
      { id: 4, name: 'Rapid Bolt', power: 'speed', status: 'available', missionsCount: 5 },
      { id: 5, name: 'Ghost Veil', power: 'invisibility', status: 'busy', missionsCount: 8 },
    ],
  });

  const incidents = [
    { id: 1, location: 'Riverfront 10', district: 'north', level: 'low', status: 'open', heroId: null, assignedAt: null, resolvedAt: null, categoryIds: [1] },
    { id: 2, location: 'Old Market 5', district: 'center', level: 'medium', status: 'assigned', heroId: 2, assignedAt: new Date('2026-03-15T10:00:00Z'), resolvedAt: null, categoryIds: [2, 3] },
    { id: 3, location: 'Harbor Gate 2', district: 'west', level: 'critical', status: 'resolved', heroId: 1, assignedAt: new Date('2026-03-14T08:00:00Z'), resolvedAt: new Date('2026-03-14T09:30:00Z'), categoryIds: [4] },
    { id: 4, location: 'Airport Ring 7', district: 'east', level: 'critical', status: 'assigned', heroId: 1, assignedAt: new Date('2026-03-12T11:15:00Z'), resolvedAt: null, categoryIds: [4, 5] },
    { id: 5, location: 'Central Bank 1', district: 'center', level: 'medium', status: 'resolved', heroId: 5, assignedAt: new Date('2026-03-10T12:00:00Z'), resolvedAt: new Date('2026-03-10T13:00:00Z'), categoryIds: [3] },
    { id: 6, location: 'Steel Bridge 3', district: 'south', level: 'low', status: 'open', heroId: null, assignedAt: null, resolvedAt: null, categoryIds: [5] },
    { id: 7, location: 'Tech Plaza 14', district: 'north', level: 'medium', status: 'resolved', heroId: 4, assignedAt: new Date('2026-03-09T06:00:00Z'), resolvedAt: new Date('2026-03-09T06:20:00Z'), categoryIds: [2, 5] },
    { id: 8, location: 'Museum Lane 9', district: 'west', level: 'critical', status: 'assigned', heroId: 2, assignedAt: new Date('2026-03-16T18:00:00Z'), resolvedAt: null, categoryIds: [3, 4] },
  ];

  for (const incident of incidents) {
    await prisma.incident.create({
      data: {
        id: incident.id,
        location: incident.location,
        district: incident.district,
        level: incident.level,
        status: incident.status,
        heroId: incident.heroId,
        assignedAt: incident.assignedAt,
        resolvedAt: incident.resolvedAt,
        categories: {
          create: incident.categoryIds.map((categoryId) => ({
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
