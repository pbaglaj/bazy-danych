exports.seed = async function(knex) {
  await knex('heroes').insert([
    { id: 1, name: 'Superman', power: 'flight', status: 'available', missions_count: 5 },
    { id: 2, name: 'Hulk', power: 'strength', status: 'busy', missions_count: 12 },
    { id: 3, name: 'Prof X', power: 'telepathy', status: 'retired', missions_count: 150 },
    { id: 4, name: 'Flash', power: 'speed', status: 'available', missions_count: 3 },
    { id: 5, name: 'Invisible Woman', power: 'invisibility', status: 'busy', missions_count: 8 }
  ]);

  await knex('incidents').insert([
    { id: 1, location: 'Bank', level: 'low', status: 'open', hero_id: null },
    { id: 2, location: 'Bridge', level: 'critical', status: 'open', hero_id: null },
    { id: 3, location: 'Downtown', level: 'medium', status: 'assigned', hero_id: 2, assigned_at: new Date() },
    { id: 4, location: 'Mall', level: 'medium', status: 'assigned', hero_id: 1, assigned_at: new Date() },
    { id: 5, location: 'Airport', level: 'critical', status: 'assigned', hero_id: 3, assigned_at: new Date() },
    { id: 6, location: 'School', level: 'low', status: 'resolved', hero_id: 4, assigned_at: new Date(), resolved_at: new Date() },
    { id: 7, location: 'Hospital', level: 'critical', status: 'open', hero_id: null },
    { id: 8, location: 'City Hall', level: 'medium', status: 'open', hero_id: null }
  ]);
};