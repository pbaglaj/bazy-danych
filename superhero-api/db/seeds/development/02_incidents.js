const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    faker.seed(7);

    const heroes = await queryInterface.sequelize.query('SELECT id FROM heroes ORDER BY id', {
      type: Sequelize.QueryTypes.SELECT,
    });

    const levels = ['low', 'medium', 'critical'];
    const incidentStatuses = ['open', 'assigned', 'resolved'];
    const incidentsData = [];
    const now = new Date();

    for (let i = 0; i < 60; i += 1) {
      const status = faker.helpers.arrayElement(incidentStatuses);
      const heroId = status !== 'open' ? faker.helpers.arrayElement(heroes).id : null;

      incidentsData.push({
        location: faker.location.streetAddress(),
        district: faker.location.county(),
        level: faker.helpers.arrayElement(levels),
        status,
        hero_id: heroId,
        assigned_at: status !== 'open' ? faker.date.recent() : null,
        resolved_at: status === 'resolved' ? faker.date.recent() : null,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert('incidents', incidentsData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('incidents', null, {});
  },
};