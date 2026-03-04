const statsService = require('../services/statsService');

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

// GET /api/v1/stats
const getStats = async (req, res) => {
  try {
    const stats = await statsService.getStats();
    res.json({ data: stats });
  } catch (err) { handleError(err, res); }
};

module.exports = { getStats };