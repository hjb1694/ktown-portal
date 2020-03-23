exports.up = function(knex) {
  return knex.schema.createTable('forum_categories', table => {
      table.increments('id');
      table.string('category').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('forum_categories');
};
