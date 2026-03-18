const { Op } = require('sequelize');
const { Hero, Incident } = require('../models');

const findAll = async ({ filters = {}, pagination = {} }) => {
  const { level, status, district } = filters;
  const { limit, offset } = pagination;

  const where = {};

  if (level) where.level = level;
  if (status) where.status = status;
  if (district) where.district = { [Op.iLike]: `%${district}%` };

  const { rows, count } = await Incident.findAndCountAll({
    where,
    order: [['id', 'ASC']],
    limit,
    offset,
  });

  const data = rows.map((incident) => incident.get({ plain: true }));
  const total = Number(count) || 0;

  return { data, total };
};

const findById = async (id, transaction) => {
  const options = {
    transaction,
    include: [
      {
        model: Hero,
        as: 'hero',
        required: false,
        attributes: ['id', 'name', 'power', 'status', 'missions_count', 'created_at', 'updated_at'],
      },
    ],
  };

  if (transaction) {
    options.lock = true;
  }

  const incident = await Incident.findByPk(id, options);
  return incident ? incident.get({ plain: true }) : null;
};

const create = async ({ location, level, district }) => {
  const incident = await Incident.create({ location, level, district });
  return incident.get({ plain: true });
};

const update = async (id, fields, transaction) => {
  const [, rows] = await Incident.update(fields, {
    where: { id },
    returning: true,
    transaction,
  });

  return rows[0] ? rows[0].get({ plain: true }) : null;
};

module.exports = { findAll, findById, create, update };