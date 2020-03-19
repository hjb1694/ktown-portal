
exports.up = function(knex) {
  return knex.schema.createTable('posting_statuses', table => {
      table.increments('id');
      table.string('status').notNullable().unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posting_statuses');
};
