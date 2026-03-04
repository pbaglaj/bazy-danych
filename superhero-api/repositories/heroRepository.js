const db = require('../db/knex');

const findAll = async (filters = {}) => {
  const query = db('heroes').select('id', 'name', 'power', 'status').orderBy('id');

  if (filters.status) {
    query.where('status', filters.status);
  }

  if (filters.power) {
    query.where('power', filters.power);
  }

  return await query;
};

const create = async ({ name, power }) => {
  const [hero] = await db('heroes')
    .insert({ name, power })
    .returning(['id', 'name', 'power', 'status']);
  
  return hero;
};

const findById = async (id) => {
  return await db('heroes').where({ id }).first();
};

const findByName = async (name) => {
  return await db('heroes')
    .where({ name })
    .select('id', 'name', 'power', 'status')
    .first(); 
};

module.exports = { findAll, create, findByName, findById };