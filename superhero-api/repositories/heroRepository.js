const db = require('../db/knex');

const ALLOWED_SORT_COLUMNS = ['name', 'missions_count', 'created_at'];

const findAll = async ({ filters = {}, sort = {}, pagination = {} }) => {
  const { status, power } = filters;
  const { sortBy = 'created_at', sortOrder = 'asc' } = sort;
  const { limit, offset } = pagination;

  const base = db('heroes');

  if (status) base.where('status', status);
  if (power) base.where('power', power);

  const column = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at';

  const countQuery = base.clone().count('* as total').first();

  const dataQuery = base.clone()
    .select('id', 'name', 'power', 'status', 'missions_count', 'created_at', 'updated_at')
    .orderBy(column, sortOrder === 'desc' ? 'desc' : 'asc')
    .limit(limit)
    .offset(offset);

  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  const total = parseInt(countResult.total, 10) || 0;

  return { data, total };
};

const findById = async (id, trx) => {
  const qb = trx || db;
  return qb('heroes').where({ id }).first();
};

const findByName = async (name) => {
  return db('heroes')
    .where({ name })
    .first();
};

const create = async ({ name, power }) => {
  const [hero] = await db('heroes')
    .insert({ name, power })
    .returning('*');

  return hero;
};

const update = async (id, fields, trx) => {
  const qb = trx || db;
  const [hero] = await qb('heroes')
    .where({ id })
    .update({ ...fields, updated_at: db.fn.now() })
    .returning('*');

  return hero;
};

const findIncidentsForHero = async ({ heroId, pagination = {} }) => {
  const { limit, offset } = pagination;

  const base = db('incidents').where('hero_id', heroId);

  const countQuery = base.clone().count('* as total').first();

  const dataQuery = base.clone()
    .select('*')
    .orderBy('assigned_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  const total = parseInt(countResult.total, 10) || 0;

  return { data, total };
};

module.exports = { findAll, findById, findByName, create, update, findIncidentsForHero };