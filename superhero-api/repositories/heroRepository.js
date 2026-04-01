const prisma = require('../db/prisma');

const ALLOWED_SORT_COLUMNS = ['name', 'missions_count', 'created_at'];
const SORT_COLUMN_MAP = {
  name: 'name',
  missions_count: 'missionsCount',
  created_at: 'createdAt',
};

const AVAILABLE_HERO_WHERE = Object.freeze({ status: 'available' });

const mapHero = (hero) => ({
  id: hero.id,
  name: hero.name,
  power: hero.power,
  status: hero.status,
  missions_count: hero.missionsCount,
  created_at: hero.createdAt,
  updated_at: hero.updatedAt,
});

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
});

const findAll = async ({ filters = {}, sort = {}, pagination = {} }) => {
  const client = prisma;
  const { status, power } = filters;
  const { sortBy = 'created_at', sortOrder = 'asc' } = sort;
  const { limit, offset } = pagination;

  const where = {};
  if (status) where.status = status;
  if (power) where.power = power;

  const column = ALLOWED_SORT_COLUMNS.includes(sortBy) ? SORT_COLUMN_MAP[sortBy] : 'createdAt';

  const [rows, count] = await client.$transaction([
    client.hero.findMany({
      where,
      orderBy: { [column]: sortOrder === 'desc' ? 'desc' : 'asc' },
      take: limit,
      skip: offset,
    }),
    client.hero.count({ where }),
  ]);

  return { data: rows.map(mapHero), total: Number(count) || 0 };
};

const findById = async (id, transaction) => {
  const client = transaction || prisma;
  const hero = await client.hero.findUnique({ where: { id } });
  return hero ? mapHero(hero) : null;
};

const findAvailableById = async (id, transaction) => {
  const client = transaction || prisma;
  const hero = await client.hero.findFirst({
    where: {
      id,
      ...AVAILABLE_HERO_WHERE,
    },
  });
  return hero ? mapHero(hero) : null;
};

const findByName = async (name) => {
  const hero = await prisma.hero.findUnique({ where: { name } });
  return hero ? mapHero(hero) : null;
};

const create = async ({ name, power }) => {
  const hero = await prisma.hero.create({ data: { name, power } });
  return mapHero(hero);
};

const update = async (id, fields, transaction) => {
  const client = transaction || prisma;

  const data = {};
  if (fields.name !== undefined) data.name = fields.name;
  if (fields.power !== undefined) data.power = fields.power;
  if (fields.status !== undefined) data.status = fields.status;
  if (fields.missions_count !== undefined) data.missionsCount = fields.missions_count;
  if (fields.missionsCount !== undefined) data.missionsCount = fields.missionsCount;

  const hero = await client.hero.update({
    where: { id },
    data,
  });

  return mapHero(hero);
};

const findIncidentsForHero = async ({ heroId, pagination = {} }) => {
  const { limit, offset } = pagination;
  const where = { heroId };

  const [rows, count] = await prisma.$transaction([
    prisma.incident.findMany({
      where,
      orderBy: { assignedAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.incident.count({ where }),
  ]);

  return { data: rows.map(mapIncident), total: Number(count) || 0 };
};

module.exports = {
  AVAILABLE_HERO_WHERE,
  findAll,
  findById,
  findAvailableById,
  findByName,
  create,
  update,
  findIncidentsForHero,
};