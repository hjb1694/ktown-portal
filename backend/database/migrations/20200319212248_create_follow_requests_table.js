
exports.up = function(knex) {
  return knex.schema.createTable('follow_requests', table => {
      table.increments('id');
      table.biginteger('follower_user_id').unsigned().notNullable()
      .references('id').inTable('users');
      table.bigInteger('followed_user_id').unsigned().notNullable()
      .references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('follow_requests');
};
