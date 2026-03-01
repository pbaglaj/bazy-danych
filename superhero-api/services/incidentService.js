const incidentRepository = require('../repositories/incidentRepository');

const toDTO = (row) => ({
  id:        row.id,
  location:  row.location,
  level:     row.level,
  status:    row.status,
  heroId:    row.hero_id,
});

const makeError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const findAll = async ({ limit, offset } = {}) => {
  const rows = await incidentRepository.findAll({ limit, offset });
  return rows.map(toDTO);
};

const create = async ({ location, level }) => {
  if (!location?.trim())           throw makeError('Location is required',         'VALIDATION_ERROR');
  if (!level?.trim())          throw makeError('Level is required',        'VALIDATION_ERROR');

  const existing = await incidentRepository.findByLocationAndLevel(location, level);
  if (existing) throw makeError('Incident with this location and level already exists', 'CONFLICT');

  const row = await incidentRepository.create({ location, level });
  return toDTO(row);
};

const assignHeroToIncident = async (incidentId, heroId) => {
  try {
    await incidentRepository.assignHeroToIncident(incidentId, heroId);
  } catch (e) {
    throw makeError(e.message, e.code || 'INTERNAL_ERROR');
  }
};

const closeIncident = async (incidentId) => {
  try {
    await incidentRepository.closeIncident(incidentId);
  } catch (e) {
    throw makeError(e.message, e.code || 'INTERNAL_ERROR');
  }
};

module.exports = { findAll, create, assignHeroToIncident, closeIncident };