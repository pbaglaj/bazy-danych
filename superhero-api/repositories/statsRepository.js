const prisma = require('../db/prisma');

const getTotalHeroes = async () => {
  const result = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS total
    FROM heroes
  `;
  return result[0]?.total || 0;
};

const getTotalIncidents = async () => {
  const result = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS total
    FROM incidents
  `;
  return result[0]?.total || 0;
};

const getHeroesByStatus = async () => {
  return prisma.$queryRaw`
    SELECT status, COUNT(*)::int AS count
    FROM heroes
    GROUP BY status
    ORDER BY status ASC
  `;
};

const getHeroesByPower = async () => {
  return prisma.$queryRaw`
    SELECT power, COUNT(*)::int AS count
    FROM heroes
    GROUP BY power
    ORDER BY power ASC
  `;
};

const getIncidentsByStatus = async () => {
  return prisma.$queryRaw`
    SELECT status, COUNT(*)::int AS count
    FROM incidents
    GROUP BY status
    ORDER BY status ASC
  `;
};

const getIncidentsByLevel = async () => {
  return prisma.$queryRaw`
    SELECT level, COUNT(*)::int AS count
    FROM incidents
    GROUP BY level
    ORDER BY level ASC
  `;
};

const getResolvedIncidentTimestamps = async () => {
  const status = 'resolved';

  return prisma.$queryRaw`
    SELECT assigned_at, resolved_at
    FROM incidents
    WHERE status = CAST(${status} AS "IncidentStatus")
      AND assigned_at IS NOT NULL
      AND resolved_at IS NOT NULL
  `;
};

module.exports = {
  getTotalHeroes,
  getTotalIncidents,
  getHeroesByStatus,
  getHeroesByPower,
  getIncidentsByStatus,
  getIncidentsByLevel,
  getResolvedIncidentTimestamps,
};