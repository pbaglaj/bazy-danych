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

// GET /api/v1/incidents?limit=10&offset=0
const getAll = async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit)  || 20, 100);
    const offset = Math.max(parseInt(req.query.offset) || 0,  0);
    const incidents  = await incidentService.findAll({ limit, offset });
    res.json({ data: incidents, meta: { limit, offset, count: incidents.length } });
  } catch (err) { handleError(err, res); }
};

// POST /api/v1/incidents
const create = async (req, res) => {
  try {
    const { location, level } = req.body || {};
    if (!location || !level)
      return res.status(400).json({ error: 'location and level are required' });
    const incident = await incidentService.create({ location, level });
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

module.exports = { getAll, create, assignHeroToIncident, closeIncident };