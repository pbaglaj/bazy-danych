exports.up = function(knex) {
  return knex.schema
    .createTable('heroes', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.enum('power', ['flight', 'strength', 'telepathy', 'speed', 'invisibility']).notNullable();
      table.enum('status', ['available', 'busy', 'retired']).defaultTo('available');
      table.timestamps(true, true); // created_at, updated_at
    })
    .createTable('incidents', (table) => {
      table.increments('id').primary();
      table.string('location').notNullable();
      table.enum('level', ['low', 'medium', 'critical']).notNullable();
      table.enum('status', ['open', 'assigned', 'resolved']).defaultTo('open');
      table.integer('hero_id').unsigned().references('id').inTable('heroes').onDelete('SET NULL');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('incidents')
    .dropTableIfExists('heroes');
};