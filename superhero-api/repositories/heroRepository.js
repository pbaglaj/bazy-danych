const pool = require('../db');

const findAll = async ({ status, power } = {}) => {
  const conditions = [];
  const params     = [];

  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status); }
  if (power)  { conditions.push(`power  = $${params.length + 1}`); params.push(power);  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT id, name, power, status
       FROM heroes
       ${where}
       ORDER BY id`,
    params
  );
  return rows;
};

const create = async ({ name, power }) => {
  const { rows } = await pool.query(
    `INSERT INTO heroes (name, power)
     VALUES ($1, $2)
     RETURNING id, name, power`,
    [name, power]
  );
  return rows[0];
};

const findByName = async (name) => {
  const { rows } = await pool.query(
    `SELECT id, name, power, status
      FROM heroes
      WHERE name = $1`,
    [name]
  );
  return rows[0];
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, name, power, status
      FROM heroes
      WHERE id = $1`,
    [id]
  );
  return rows[0];
};

const updateStatus = async (client, id, newStatus, expectedStatus) => {
  const { rows } = await client.query(
    `UPDATE heroes SET status = $1
     WHERE id = $2 AND status = $3
     RETURNING id, name, power, status`,
    [newStatus, id, expectedStatus]
  );
  return rows[0];
};

module.exports = { findAll, create, findByName, findById, updateStatus };