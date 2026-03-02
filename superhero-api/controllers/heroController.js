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

// GET /api/v1/heroes?status=available&power=flight
const getAll = async (req, res) => {
  try {
    const { status, power } = req.query;
    const heroes = await heroService.findAll({ status, power });
    res.json({ data: heroes, meta: { count: heroes.length } });
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

module.exports = { getAll, create };