exports.up = function(knex) {
  return knex.schema
    .alterTable('heroes', (table) => {
      table.integer('missions_count').defaultTo(0).notNullable();
    })
    .alterTable('incidents', (table) => {
      table.string('district').nullable();
      table.timestamp('assigned_at').nullable();
      table.timestamp('resolved_at').nullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('incidents', (table) => {
      table.dropColumns('district', 'assigned_at', 'resolved_at');
    })
    .alterTable('heroes', (table) => {
      table.dropColumn('missions_count');
    });
};