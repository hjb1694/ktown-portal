
exports.up = function(knex) {
  return knex.schema.createTable('account_statuses', table => {
    table.increments('id');
    table.string('status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('account_statuses');
};
