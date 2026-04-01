const prisma = require('../db/prisma');

const mapHero = (hero) => {
  if (!hero) return null;

  return {
    id: hero.id,
    name: hero.name,
    power: hero.power,
    status: hero.status,
    missions_count: hero.missionsCount,
    created_at: hero.createdAt,
    updated_at: hero.updatedAt,
  };
};

const mapCategories = (categories = []) => {
  return categories.map((item) => ({
    incident_id: item.incidentId,
    category_id: item.categoryId,
    category: item.category
      ? {
          id: item.category.id,
          name: item.category.name,
        }
      : null,
  }));
};

const mapIncident = (incident) => ({
  id: incident.id,
  location: incident.location,
  district: incident.district,
  level: incident.level,
  status: incident.status,
  hero_id: incident.heroId,
  assigned_at: incident.assignedAt,
  resolved_at: incident.resolvedAt,
  created_at: incident.createdAt,
  updated_at: incident.updatedAt,
  hero: mapHero(incident.hero),
  categories: mapCategories(incident.categories),
});

const findAll = async ({ filters = {}, pagination = {} }) => {
  const { level, status, district, categoryId, exclude } = filters;
  const { limit, offset } = pagination;

  const where = {};
  if (level) where.level = level;
  if (status) where.status = status;
  if (district) {
    where.district = {
      contains: district,
      mode: 'insensitive',
    };
  }

  if (categoryId) {
    where.categories = {
      some: {
        categoryId,
      },
    };
  }

  if (exclude) {
    where.categories = {
      ...where.categories,
      none: {
        categoryId: exclude,
      },
    };
  }

  const [rows, count] = await prisma.$transaction([
    prisma.incident.findMany({
      where,
      orderBy: { id: 'asc' },
      take: limit,
      skip: offset,
    }),
    prisma.incident.count({ where }),
  ]);

  return { data: rows.map(mapIncident), total: Number(count) || 0 };
};

const findById = async (id, transaction) => {
  const client = transaction || prisma;

  const incident = await client.incident.findUnique({
    where: { id },
    include: {
      hero: {
        select: {
          id: true,
          name: true,
          power: true,
          status: true,
          missionsCount: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return incident ? mapIncident(incident) : null;
};

const create = async ({ location, level, district, categoryIds = [] }) => {
  const uniqueCategoryIds = [...new Set(categoryIds)];

  const incident = await prisma.incident.create({
    data: {
      location,
      level,
      district,
      categories: uniqueCategoryIds.length > 0
        ? {
            create: uniqueCategoryIds.map((categoryId) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          }
        : undefined,
    },
    include: {
      hero: {
        select: {
          id: true,
          name: true,
          power: true,
          status: true,
          missionsCount: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return mapIncident(incident);
};

const update = async (id, fields, transaction) => {
  const client = transaction || prisma;

  const data = {};
  if (fields.location !== undefined) data.location = fields.location;
  if (fields.level !== undefined) data.level = fields.level;
  if (fields.district !== undefined) data.district = fields.district;
  if (fields.status !== undefined) data.status = fields.status;
  if (fields.hero_id !== undefined) data.heroId = fields.hero_id;
  if (fields.heroId !== undefined) data.heroId = fields.heroId;
  if (fields.assigned_at !== undefined) data.assignedAt = fields.assigned_at;
  if (fields.assignedAt !== undefined) data.assignedAt = fields.assignedAt;
  if (fields.resolved_at !== undefined) data.resolvedAt = fields.resolved_at;
  if (fields.resolvedAt !== undefined) data.resolvedAt = fields.resolvedAt;

  const incident = await client.incident.update({
    where: { id },
    data,
    include: {
      hero: {
        select: {
          id: true,
          name: true,
          power: true,
          status: true,
          missionsCount: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return mapIncident(incident);
};

module.exports = { findAll, findById, create, update };