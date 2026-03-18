const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface) => {
    faker.seed(7);

    const powers = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
    const heroStatuses = ['available', 'busy', 'retired'];
    const heroesData = [];
    const now = new Date();

    for (let i = 0; i < 20; i += 1) {
      heroesData.push({
        name: `${faker.person.fullName()} ${faker.string.uuid().substring(0, 5)}`,
        power: faker.helpers.arrayElement(powers),
        status: faker.helpers.arrayElement(heroStatuses),
        missions_count: faker.number.int({ min: 0, max: 50 }),
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert('heroes', heroesData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('heroes', null, {});
  },
};