const db = require('../db/knex');

const findAll = async ({ filters = {}, pagination = {} }) => {
  const { level, status, district } = filters;
  const { limit, offset } = pagination;

  const base = db('incidents');

  if (level) base.where('level', level);
  if (status) base.where('status', status);
  if (district) base.whereILike('district', `%${district}%`);

  const countQuery = base.clone().count('* as total').first();

  const dataQuery = base.clone()
    .select('*')
    .orderBy('id')
    .limit(limit)
    .offset(offset);

  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  const total = parseInt(countResult.total, 10) || 0;

  return { data, total };
};

const findById = async (id, trx) => {
  const qb = trx || db;
  return qb('incidents').where({ id }).first();
};

const create = async ({ location, level, district }) => {
  const [incident] = await db('incidents')
    .insert({ location, level, district })
    .returning('*');

  return incident;
};

const update = async (id, fields, trx) => {
  const qb = trx || db;
  const [incident] = await qb('incidents')
    .where({ id })
    .update({ ...fields, updated_at: db.fn.now() })
    .returning('*');

  return incident;
};

module.exports = { findAll, findById, create, update };