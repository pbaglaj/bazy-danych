const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  faker.seed(7); // Gwarancja powtarzalności

  const powers = ['flight', 'strength', 'telepathy', 'speed', 'invisibility'];
  const heroStatuses = ['available', 'busy', 'retired'];
  const heroesData = [];

  for (let i = 0; i < 20; i++) {
    heroesData.push({
      name: `${faker.person.fullName()} ${faker.string.uuid().substring(0, 5)}`,
      power: faker.helpers.arrayElement(powers),
      status: faker.helpers.arrayElement(heroStatuses),
      missions_count: faker.number.int({ min: 0, max: 50 })
    });
  }

  await knex('heroes').insert(heroesData);
};