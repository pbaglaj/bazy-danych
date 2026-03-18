const { Op } = require('sequelize');
const { Hero, Incident, sequelize } = require('../models');

const getTotalHeroes = async () => {
  return Hero.count();
};

const getTotalIncidents = async () => {
  return Incident.count();
};

const getHeroesByStatus = async () => {
  const rows = await Hero.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  return rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) }));
};

const getHeroesByPower = async () => {
  const rows = await Hero.findAll({
    attributes: ['power', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['power'],
    raw: true,
  });
  return rows.map((r) => ({ power: r.power, count: parseInt(r.count, 10) }));
};

const getIncidentsByStatus = async () => {
  const rows = await Incident.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true,
  });
  return rows.map((r) => ({ status: r.status, count: parseInt(r.count, 10) }));
};

const getIncidentsByLevel = async () => {
  const rows = await Incident.findAll({
    attributes: ['level', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['level'],
    raw: true,
  });
  return rows.map((r) => ({ level: r.level, count: parseInt(r.count, 10) }));
};

const getResolvedIncidentTimestamps = async () => {
  return Incident.findAll({
    where: {
      status: 'resolved',
      assigned_at: { [Op.ne]: null },
      resolved_at: { [Op.ne]: null },
    },
    attributes: ['assigned_at', 'resolved_at'],
    raw: true,
  });
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