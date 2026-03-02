const incidentRepository = require('../repositories/incidentRepository');
const heroRepository = require('../repositories/heroRepository');

const VALID_LEVELS = ['low', 'medium', 'critical'];
const CRITICAL_POWERS = ['flight', 'strength'];

const toDTO = (row) => ({
  id:       row.id,
  location: row.location,
  level:    row.level,
  status:   row.status,
  heroId:   row.hero_id,
});

const makeError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const findAll = async ({ level, status } = {}) => {
  const rows = await incidentRepository.findAll({ level, status });
  return rows.map(toDTO);
};

const create = async ({ location, level }) => {
  if (!location?.trim()) throw makeError('Location is required', 'VALIDATION_ERROR');
  if (!level?.trim())    throw makeError('Level is required',    'VALIDATION_ERROR');

  if (!VALID_LEVELS.includes(level.trim()))
    throw makeError(`Level must be one of: ${VALID_LEVELS.join(', ')}`, 'VALIDATION_ERROR');

  const row = await incidentRepository.create({ location: location.trim(), level: level.trim() });
  return toDTO(row);
};

const assignHeroToIncident = async (incidentId, heroId) => {
  if (!heroId) throw makeError('heroId is required', 'VALIDATION_ERROR');

  const incident = await incidentRepository.findById(incidentId);
  if (!incident) throw makeError('Incident not found', 'NOT_FOUND');
  if (incident.status !== 'open') throw makeError('Incident is not open', 'CONFLICT');

  const hero = await heroRepository.findById(heroId);
  if (!hero) throw makeError('Hero not found', 'NOT_FOUND');
  if (hero.status !== 'available') throw makeError('Hero is not available', 'CONFLICT');

  if (incident.level === 'critical' && !CRITICAL_POWERS.includes(hero.power)) {
    throw makeError(
      'Critical incidents require a hero with flight or strength',
      'FORBIDDEN'
    );
  }

  const row = await incidentRepository.assignHeroToIncident(incidentId, heroId);
  return toDTO(row);
};

const closeIncident = async (incidentId) => {
  const incident = await incidentRepository.findById(incidentId);
  if (!incident) throw makeError('Incident not found', 'NOT_FOUND');
  if (incident.status !== 'assigned') throw makeError('Incident is not assigned', 'CONFLICT');

  const row = await incidentRepository.closeIncident(incidentId);
  return toDTO(row);
};

module.exports = { findAll, create, assignHeroToIncident, closeIncident };