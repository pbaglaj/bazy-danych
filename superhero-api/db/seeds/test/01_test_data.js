module.exports = {
  up: async (queryInterface) => {
    const createdAt = new Date('2026-01-01T10:00:00.000Z');
    const updatedAt = new Date('2026-01-01T10:00:00.000Z');

    await queryInterface.bulkInsert('heroes', [
      { id: 1, name: 'Superman', power: 'flight', status: 'available', missions_count: 5, created_at: createdAt, updated_at: updatedAt },
      { id: 2, name: 'Hulk', power: 'strength', status: 'busy', missions_count: 12, created_at: createdAt, updated_at: updatedAt },
      { id: 3, name: 'Prof X', power: 'telepathy', status: 'retired', missions_count: 150, created_at: createdAt, updated_at: updatedAt },
      { id: 4, name: 'Flash', power: 'speed', status: 'available', missions_count: 3, created_at: createdAt, updated_at: updatedAt },
      { id: 5, name: 'Invisible Woman', power: 'invisibility', status: 'busy', missions_count: 8, created_at: createdAt, updated_at: updatedAt },
    ]);

    await queryInterface.bulkInsert('incidents', [
      { id: 1, location: 'Bank', district: 'Downtown', level: 'low', status: 'open', hero_id: null, assigned_at: null, resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 2, location: 'Bridge', district: 'Harbor', level: 'medium', status: 'open', hero_id: null, assigned_at: null, resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 3, location: 'Airport', district: 'North', level: 'critical', status: 'open', hero_id: null, assigned_at: null, resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 4, location: 'Mall', district: 'Central', level: 'low', status: 'assigned', hero_id: 2, assigned_at: new Date('2026-01-02T10:00:00.000Z'), resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 5, location: 'Metro', district: 'Central', level: 'medium', status: 'assigned', hero_id: 1, assigned_at: new Date('2026-01-02T11:00:00.000Z'), resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 6, location: 'Power Plant', district: 'Industrial', level: 'critical', status: 'assigned', hero_id: 2, assigned_at: new Date('2026-01-02T12:00:00.000Z'), resolved_at: null, created_at: createdAt, updated_at: updatedAt },
      { id: 7, location: 'School', district: 'West', level: 'low', status: 'resolved', hero_id: 4, assigned_at: new Date('2026-01-03T09:00:00.000Z'), resolved_at: new Date('2026-01-03T09:40:00.000Z'), created_at: createdAt, updated_at: updatedAt },
      { id: 8, location: 'Hospital', district: 'East', level: 'medium', status: 'resolved', hero_id: 1, assigned_at: new Date('2026-01-03T10:00:00.000Z'), resolved_at: new Date('2026-01-03T10:15:00.000Z'), created_at: createdAt, updated_at: updatedAt },
      { id: 9, location: 'City Hall', district: 'Old Town', level: 'critical', status: 'resolved', hero_id: 2, assigned_at: new Date('2026-01-03T11:00:00.000Z'), resolved_at: new Date('2026-01-03T11:25:00.000Z'), created_at: createdAt, updated_at: updatedAt },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('incidents', null, {});
    await queryInterface.bulkDelete('heroes', null, {});
  },
};