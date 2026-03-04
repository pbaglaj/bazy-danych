const db = require('../db/knex');

const getTotalHeroes = async () => {
  const result = await db('heroes').count('* as total').first();
  return parseInt(result.total, 10) || 0;
};

const getTotalIncidents = async () => {
  const result = await db('incidents').count('* as total').first();
  return parseInt(result.total, 10) || 0;
};

const getHeroesByStatus = async () => {
  const rows = await db('heroes')
    .select('status')
    .count('* as count')
    .groupBy('status');
  return rows.map(r => ({ status: r.status, count: parseInt(r.count, 10) }));
};

const getHeroesByPower = async () => {
  const rows = await db('heroes')
    .select('power')
    .count('* as count')
    .groupBy('power');
  return rows.map(r => ({ power: r.power, count: parseInt(r.count, 10) }));
};

const getIncidentsByStatus = async () => {
  const rows = await db('incidents')
    .select('status')
    .count('* as count')
    .groupBy('status');
  return rows.map(r => ({ status: r.status, count: parseInt(r.count, 10) }));
};

const getIncidentsByLevel = async () => {
  const rows = await db('incidents')
    .select('level')
    .count('* as count')
    .groupBy('level');
  return rows.map(r => ({ level: r.level, count: parseInt(r.count, 10) }));
};

const getResolvedIncidentTimestamps = async () => {
  return db('incidents')
    .where('status', 'resolved')
    .whereNotNull('assigned_at')
    .whereNotNull('resolved_at')
    .select('assigned_at', 'resolved_at');
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