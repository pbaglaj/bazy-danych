const sequelize = require('../db/sequelize');
const initHeroModel = require('./Hero');
const initIncidentModel = require('./Incident');

const Hero = initHeroModel(sequelize);
const Incident = initIncidentModel(sequelize);

Hero.hasMany(Incident, { foreignKey: 'hero_id', as: 'incidents' });
Incident.belongsTo(Hero, { foreignKey: 'hero_id', as: 'hero' });

module.exports = {
  sequelize,
  Hero,
  Incident,
};
