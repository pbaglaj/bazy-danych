const db = require('../db/knex');

const findAll = async ({ level, status } = {}) => {
  const query = db('incidents').select('id', 'location', 'level', 'status', 'hero_id').orderBy('id');

  if (level) {
    query.where('level', level);
  }

  if (status) {
    query.where('status', status);
  }

  return await query;
};

const create = async ({ location, level }) => {
  const [incident] = await db('incidents').insert({ location, level }).returning(['id', 'location', 'level']);

  return incident;
};

const assignHeroToIncident = async (incidentId, heroId) => {
    db.transaction(async (trx) => {
        const hero = await trx('heroes').where({ id: heroId, status: 'available' }).first();
        if (!hero) throw new Error('Hero not available');
        await trx('heroes').where({ id: heroId }).update({ status: 'busy' });
        const [incident] = await trx('incidents').where({ id: incidentId }).update({ hero_id: heroId, status: 'assigned' }).returning(['id', 'location', 'level', 'status', 'hero_id']);
        return incident;
    });
};

const closeIncident = async (incidentId) => {
    db.transaction(async (trx) => {
        const incident = await trx('incidents').where({ id: incidentId, status: 'assigned' }).first();
        if (!incident) throw new Error('Incident not assigned');
        const heroId = incident.hero_id;
        await trx('incidents').where({ id: incidentId }).update({ status: 'resolved' });
        await trx('heroes').where({ id: heroId }).update({ status: 'available' });
        const [incidentRow] = await trx('incidents').where({ id: incidentId }).select('id', 'location', 'level', 'status', 'hero_id');
        return incidentRow;
    });
}

const findByLocationAndLevel = async (location, level) => {
  const [incident] = await db.select('id', 'location', 'level', 'status', 'hero_id')
    .from('incidents')
    .where({ location, level })
    .first();
    
  return incident;
};

const findById = async (id) => {
  const [incident] = await db.select('id', 'location', 'level', 'status', 'hero_id')
    .from('incidents')
    .where({ id });

  return incident;
};

module.exports = { assignHeroToIncident, findAll, create, closeIncident, findByLocationAndLevel, findById };