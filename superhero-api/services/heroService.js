const heroRepository = require('../repositories/heroRepository');

const VALID_POWERS = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
const VALID_STATUSES = ['available', 'busy', 'retired'];
const ALLOWED_SORT_COLUMNS = ['name', 'missions_count', 'created_at'];
const MAX_PAGE_SIZE = 50;

const toDTO = (row) => ({
  id:            row.id,
  name:          row.name,
  power:         row.power,
  status:        row.status,
  missions_count: row.missions_count,
  created_at:    row.created_at,
  updated_at:    row.updated_at,
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
  const { status, power, sortBy, sortOrder } = query;
  const { page, pageSize, limit, offset } = parsePagination(query);

  const filters = {};
  if (status && VALID_STATUSES.includes(status)) filters.status = status;
  if (power && VALID_POWERS.includes(power)) filters.power = power;

  const sort = {
    sortBy: ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at',
    sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
  };

  const { data, total } = await heroRepository.findAll({ filters, sort, pagination: { limit, offset } });

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
  const hero = await heroRepository.findById(id);
  if (!hero) throw makeError('Hero not found', 'NOT_FOUND');
  return toDTO(hero);
};

const create = async ({ name, power }) => {
  if (!name?.trim())  throw makeError('Name is required',  'VALIDATION_ERROR');
  if (!power?.trim()) throw makeError('Power is required', 'VALIDATION_ERROR');

  if (!VALID_POWERS.includes(power.trim()))
    throw makeError(`Power must be one of: ${VALID_POWERS.join(', ')}`, 'VALIDATION_ERROR');

  const existing = await heroRepository.findByName(name.trim());
  if (existing) throw makeError('Hero with this name already exists', 'CONFLICT');

  const row = await heroRepository.create({ name: name.trim(), power: power.trim() });
  return toDTO(row);
};

const update = async (id, fields) => {
  const hero = await heroRepository.findById(id);
  if (!hero) throw makeError('Hero not found', 'NOT_FOUND');

  const updateData = {};
  if (fields.name !== undefined) {
    if (!fields.name.trim()) throw makeError('Name cannot be empty', 'VALIDATION_ERROR');
    const existing = await heroRepository.findByName(fields.name.trim());
    if (existing && existing.id !== id) throw makeError('Hero with this name already exists', 'CONFLICT');
    updateData.name = fields.name.trim();
  }
  if (fields.power !== undefined) {
    if (!VALID_POWERS.includes(fields.power))
      throw makeError(`Power must be one of: ${VALID_POWERS.join(', ')}`, 'VALIDATION_ERROR');
    updateData.power = fields.power;
  }
  if (fields.status !== undefined) {
    if (!VALID_STATUSES.includes(fields.status))
      throw makeError(`Status must be one of: ${VALID_STATUSES.join(', ')}`, 'VALIDATION_ERROR');
    updateData.status = fields.status;
  }

  if (Object.keys(updateData).length === 0)
    throw makeError('No valid fields to update', 'VALIDATION_ERROR');

  const row = await heroRepository.update(id, updateData);
  return toDTO(row);
};

const findIncidentsForHero = async (heroId, query = {}) => {
  const hero = await heroRepository.findById(heroId);
  if (!hero) throw makeError('Hero not found', 'NOT_FOUND');

  const { page, pageSize, limit, offset } = parsePagination(query);

  const { data, total } = await heroRepository.findIncidentsForHero({ heroId, pagination: { limit, offset } });

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 0,
    },
  };
};

module.exports = { findAll, findById, create, update, findIncidentsForHero };