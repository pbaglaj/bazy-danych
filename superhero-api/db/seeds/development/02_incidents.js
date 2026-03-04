const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  faker.seed(7); 
  
  const heroes = await knex('heroes').select('id');
  
  const levels = ['low', 'medium', 'critical'];
  const incidentStatuses = ['open', 'assigned', 'resolved'];
  const incidentsData = [];

  for (let i = 0; i < 60; i++) {
    const status = faker.helpers.arrayElement(incidentStatuses);
    
    const heroId = status !== 'open' ? faker.helpers.arrayElement(heroes).id : null;
    
    incidentsData.push({
      location: faker.location.streetAddress(),
      district: faker.location.county(),
      level: faker.helpers.arrayElement(levels),
      status: status,
      hero_id: heroId,
      assigned_at: status !== 'open' ? faker.date.recent() : null,
      resolved_at: status === 'resolved' ? faker.date.recent() : null
    });
  }

  await knex('incidents').insert(incidentsData);
};