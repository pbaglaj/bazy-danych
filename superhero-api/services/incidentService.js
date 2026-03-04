const db = require('../db/knex');
const incidentRepository = require('../repositories/incidentRepository');
const heroRepository = require('../repositories/heroRepository');

const VALID_LEVELS = ['low', 'medium', 'critical'];
const VALID_STATUSES = ['open', 'assigned', 'resolved'];
const CRITICAL_POWERS = ['flight', 'strength'];
const MAX_PAGE_SIZE = 50;

const toDTO = (row) => ({
  id:          row.id,
  location:    row.location,
  district:    row.district || null,
  level:       row.level,
  status:      row.status,
  heroId:      row.hero_id || null,
  assigned_at: row.assigned_at || null,
  resolved_at: row.resolved_at || null,
  created_at:  row.created_at,
  updated_at:  row.updated_at,
});

const makeError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize, 10) || 20, 1), MAX_PAGE_SIZE);
  return { page, pageSize, limit: pageSize, offset: (page - 1) * pageSize };
};

const findAll = async (query = {}) => {
  const { level, status, district } = query;
  const { page, pageSize, limit, offset } = parsePagination(query);

  const filters = {};
  if (level && VALID_LEVELS.includes(level)) filters.level = level;
  if (status && VALID_STATUSES.includes(status)) filters.status = status;
  if (district) filters.district = district;

  const { data, total } = await incidentRepository.findAll({ filters, pagination: { limit, offset } });

  return {
    data: data.map(toDTO),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 0,
    },
  };
};

const findById = async (id) => {
  const incident = await incidentRepository.findById(id);
  if (!incident) throw makeError('Incident not found', 'NOT_FOUND');
  return toDTO(incident);
};

const create = async ({ location, level, district }) => {
  if (!location?.trim()) throw makeError('Location is required', 'VALIDATION_ERROR');
  if (!level?.trim())    throw makeError('Level is required',    'VALIDATION_ERROR');

  if (!VALID_LEVELS.includes(level.trim()))
    throw makeError(`Level must be one of: ${VALID_LEVELS.join(', ')}`, 'VALIDATION_ERROR');

  const row = await incidentRepository.create({
    location: location.trim(),
    level: level.trim(),
    district: district?.trim() || null,
  });
  return toDTO(row);
};

const assignHeroToIncident = async (incidentId, heroId) => {
  if (!heroId) throw makeError('heroId is required', 'VALIDATION_ERROR');

  const result = await db.transaction(async (trx) => {
    const incident = await incidentRepository.findById(incidentId, trx);
    if (!incident) throw makeError('Incident not found', 'NOT_FOUND');
    if (incident.status !== 'open') throw makeError('Incident is not open', 'CONFLICT');

    const hero = await heroRepository.findById(heroId, trx);
    if (!hero) throw makeError('Hero not found', 'NOT_FOUND');
    if (hero.status !== 'available') throw makeError('Hero is not available', 'CONFLICT');

    if (incident.level === 'critical' && !CRITICAL_POWERS.includes(hero.power)) {
      throw makeError(
        'Critical incidents require a hero with flight or strength',
        'FORBIDDEN'
      );
    }

    await heroRepository.update(heroId, { status: 'busy', missions_count: hero.missions_count + 1 }, trx);

    const updatedIncident = await incidentRepository.update(incidentId, {
      hero_id: heroId,
      status: 'assigned',
      assigned_at: new Date(),
    }, trx);

    return updatedIncident;
  });

  return toDTO(result);
};

const closeIncident = async (incidentId) => {
  const result = await db.transaction(async (trx) => {
    const incident = await incidentRepository.findById(incidentId, trx);
    if (!incident) throw makeError('Incident not found', 'NOT_FOUND');
    if (incident.status !== 'assigned') throw makeError('Incident is not assigned', 'CONFLICT');

    await heroRepository.update(incident.hero_id, { status: 'available' }, trx);

    const updatedIncident = await incidentRepository.update(incidentId, {
      status: 'resolved',
      resolved_at: new Date(),
    }, trx);

    return updatedIncident;
  });

  return toDTO(result);
};

module.exports = { findAll, findById, create, assignHeroToIncident, closeIncident };