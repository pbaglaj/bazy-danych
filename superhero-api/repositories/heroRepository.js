const { Incident, Hero } = require('../models');

const ALLOWED_SORT_COLUMNS = ['name', 'missions_count', 'created_at'];

const findAll = async ({ filters = {}, sort = {}, pagination = {} }) => {
  const { status, power } = filters;
  const { sortBy = 'created_at', sortOrder = 'asc' } = sort;
  const { limit, offset } = pagination;

  const where = {};

  if (status) where.status = status;
  if (power) where.power = power;

  const column = ALLOWED_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at';

  const { rows, count } = await Hero.findAndCountAll({
    where,
    attributes: ['id', 'name', 'power', 'status', 'missions_count', 'created_at', 'updated_at'],
    order: [[column, sortOrder === 'desc' ? 'DESC' : 'ASC']],
    limit,
    offset,
  });

  const data = rows.map((hero) => hero.get({ plain: true }));
  const total = Number(count) || 0;

  return { data, total };
};

const findById = async (id, transaction) => {
  const options = { transaction };
  if (transaction) {
    options.lock = true;
  }

  const hero = await Hero.findByPk(id, options);
  return hero ? hero.get({ plain: true }) : null;
};

const findAvailableById = async (id, transaction) => {
  const options = { transaction };
  if (transaction) {
    options.lock = true;
  }

  const hero = await Hero.scope('available').findByPk(id, options);
  return hero ? hero.get({ plain: true }) : null;
};

const findByName = async (name) => {
  const hero = await Hero.findOne({ where: { name } });
  return hero ? hero.get({ plain: true }) : null;
};

const create = async ({ name, power }) => {
  const hero = await Hero.create({ name, power });
  return hero.get({ plain: true });
};

const update = async (id, fields, transaction) => {
  const [, rows] = await Hero.update(fields, {
    where: { id },
    returning: true,
    transaction,
  });

  return rows[0] ? rows[0].get({ plain: true }) : null;
};

const findIncidentsForHero = async ({ heroId, pagination = {} }) => {
  const { limit, offset } = pagination;

  const { rows, count } = await Incident.findAndCountAll({
    where: { hero_id: heroId },
    order: [['assigned_at', 'DESC']],
    limit,
    offset,
  });

  const data = rows.map((incident) => incident.get({ plain: true }));
  const total = Number(count) || 0;

  return { data, total };
};

module.exports = { findAll, findById, findAvailableById, findByName, create, update, findIncidentsForHero };