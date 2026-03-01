const heroRepository = require('../repositories/heroRepository');

const toDTO = (row) => ({
  id:        row.id,
  name:      row.name,
  power:     row.power,
  status: row.status,
});

const makeError = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

const findAll = async ({ limit, offset } = {}) => {
  const rows = await heroRepository.findAll({ limit, offset });
  return rows.map(toDTO);
};

const create = async ({ name, power }) => {
  if (!name?.trim())           throw makeError('Name is required',         'VALIDATION_ERROR');
  if (!power?.trim())          throw makeError('Power is required',        'VALIDATION_ERROR');

  const existing = await heroRepository.findByName(name);
  if (existing) throw makeError('Hero with this name already exists', 'CONFLICT');

  const row = await heroRepository.create({ name: name.trim(), power: power.trim() });
  return toDTO(row);
};

module.exports = { findAll, create };