
exports.up = function(knex) {
  return knex.schema.createTable('followers', table => {
    table.increments('id');
    table.bigInteger('follower_user_id').unsigned().notNullable()
    .references('id').inTable('users');
    table.bigInteger('followed_user_id').unsigned().notNullable()
    .references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('followers');
};
