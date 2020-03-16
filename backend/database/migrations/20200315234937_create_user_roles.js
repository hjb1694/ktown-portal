
exports.up = function(knex) {
  return knex.schema.createTable('user_roles', table => {
      table.increments('id');
      table.string('role');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_roles');
};
