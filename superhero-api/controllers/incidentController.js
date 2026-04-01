const incidentService = require('../services/incidentService');

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

// GET /api/v1/incidents?level=critical&status=open&district=downtown&page=1&pageSize=20
const getAll = async (req, res) => {
  try {
    const result = await incidentService.findAll(req.query);
    res.json({ data: result.data, pagination: result.pagination });
  } catch (err) { handleError(err, res); }
};

// GET /api/v1/incidents/:id
const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const incident = await incidentService.findById(id);
    res.json({ data: incident });
  } catch (err) { handleError(err, res); }
};

// POST /api/v1/incidents
const create = async (req, res) => {
  try {
    const { location, level, district, categoryIds } = req.body || {};
    if (!location || !level)
      return res.status(400).json({ error: 'location and level are required' });
    const incident = await incidentService.create({ location, level, district, categoryIds });
    res.status(201)
       .location(`/api/v1/incidents/${incident.id}`)
       .json({ data: incident });
  } catch (err) { handleError(err, res); }
};

// POST /api/v1/incidents/:id/assign
const assignHeroToIncident = async (req, res) => {
  try {
    const incidentId = parseInt(req.params.id, 10);
    const { heroId } = req.body || {};
    const incident = await incidentService.assignHeroToIncident(incidentId, heroId);
    res.json({ data: incident });
  } catch (err) { handleError(err, res); }
};

// PATCH /api/v1/incidents/:id/resolve
const closeIncident = async (req, res) => {
  try {
    const incidentId = parseInt(req.params.id, 10);
    const incident = await incidentService.closeIncident(incidentId);
    res.json({ data: incident });
  } catch (err) { handleError(err, res); }
};

module.exports = { getAll, create, assignHeroToIncident, closeIncident, getById };