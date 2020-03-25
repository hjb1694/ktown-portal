exports.up = function(knex) {
  return knex.schema.createTable('forum_posts', table => {
      table.increments('id');
      table.bigInteger('author_user_id').notNullable()
      .references('id').inTable('users');
      table.integer('category_id').notNullable()
      .references('id').inTable('forum_categories');
      table.string('headline').notNullable();
      table.text('content').notNullable();
      table.string('main_img');
      table.integer('posting_status').notNullable()
      .references('id').inTable('posting_statuses').defaultsTo(1);
      table.timestamps(true,true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('forum_posts');
};
