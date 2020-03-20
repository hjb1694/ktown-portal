exports.up = function(knex) {
  return knex.schema.createTable('blocked_users', table => {
      table.increments('id');
      table.integer('blocker_user_id').unsigned().notNullable()
      .references('id').inTable('users');
      table.integer('blocked_user_id').unsigned().notNullable()
      .references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('blocked_users');
};
