const pool = require('../db');

const findAll = async ({ limit = 20, offset = 0 } = {}) => {
  const { rows } = await pool.query(
    `SELECT id, location, level, status, hero_id
      FROM incidents
      ORDER BY id
      LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

const create = async ({ location, level }) => {
  const { rows } = await pool.query(
    `INSERT INTO incidents (location, level)
    VALUES ($1, $2)
    RETURNING id, location, level`,
    [location, level]
    );
    return rows[0];
};

const assignHeroToIncident = async (incidentId, heroId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const heroRes = await client.query(
            'UPDATE heroes SET status = $1 WHERE id = $2 AND status = $3 RETURNING id',
            ['busy', heroId, 'available']
        );

        if (heroRes.rowCount === 0) throw new Error('Hero not available');

        await client.query(
            'UPDATE incidents SET hero_id = $1, status = $2 WHERE id = $3',
            [heroId, 'assigned', incidentId]
        );

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

const closeIncident = async (incidentId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const incidentRes = await client.query(
            'SELECT hero_id FROM incidents WHERE id = $1 AND status = $2',
            [incidentId, 'assigned']
        );
        if (incidentRes.rowCount === 0) throw new Error('Incident not assigned');
        const heroId = incidentRes.rows[0].hero_id;
        await client.query(
            'UPDATE incidents SET status = $1 WHERE id = $2',
            ['resolved', incidentId]
        );
        await client.query(
            'UPDATE heroes SET status = $1 WHERE id = $2',
            ['available', heroId]
        );
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

const findByLocationAndLevel = async (location, level) => {
  const { rows } = await pool.query(
    `SELECT id, location, level, status, hero_id
      FROM incidents
      WHERE location = $1 AND level = $2`,
    [location, level]
  );
  return rows[0];
};

module.exports = { assignHeroToIncident, findAll, create, closeIncident, findByLocationAndLevel };