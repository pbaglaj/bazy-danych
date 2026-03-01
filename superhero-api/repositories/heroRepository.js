const pool = require('../db');

const findAll = async ({ limit = 20, offset = 0 } = {}) => {
  const { rows } = await pool.query(
    `SELECT id, name, power, status
      FROM heroes
      ORDER BY id
      LIMIT $1 OFFSET $2`,
    [limit, offset]
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

module.exports = { findAll, create };