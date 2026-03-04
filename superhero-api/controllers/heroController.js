const heroService = require('../services/heroService');

const HTTP_STATUS = {
  NOT_FOUND:        404,
  CONFLICT:         409,
  VALIDATION_ERROR: 422,
  FORBIDDEN:        403,
};

const handleError = (err, res) => {
  const status = HTTP_STATUS[err.code] || 500;
  const body   = status === 500
    ? { error: 'Internal Server Error' }
    : { error: err.message };
  if (status === 500) console.error(err);
  res.status(status).json(body);
};

// GET /api/v1/heroes?status=available&power=flight&sortBy=name&sortOrder=asc&page=1&pageSize=20
const getAll = async (req, res) => {
  try {
    const result = await heroService.findAll(req.query);
    res.json({ data: result.data, pagination: result.pagination });
  } catch (err) { handleError(err, res); }
};

// GET /api/v1/heroes/:id
const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hero = await heroService.findById(id);
    res.json({ data: hero });
  } catch (err) { handleError(err, res); }
};

// POST /api/v1/heroes
const create = async (req, res) => {
  try {
    const { name, power } = req.body || {};
    if (!name || !power)
      return res.status(400).json({ error: 'name and power are required' });
    const hero = await heroService.create({ name, power });
    res.status(201)
       .location(`/api/v1/heroes/${hero.id}`)
       .json({ data: hero });
  } catch (err) { handleError(err, res); }
};

// PATCH /api/v1/heroes/:id
const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const hero = await heroService.update(id, req.body || {});
    res.json({ data: hero });
  } catch (err) { handleError(err, res); }
};

// GET /api/v1/heroes/:id/incidents
const getIncidentsForHero = async (req, res) => {
  try {
    const heroId = parseInt(req.params.id, 10);
    const result = await heroService.findIncidentsForHero(heroId, req.query);
    res.json({ data: result.data, pagination: result.pagination });
  } catch (err) { handleError(err, res); }
};

module.exports = { getAll, create, getById, getIncidentsForHero, update };