
exports.up = function(knex) {
  return knex.schema.createTable('notifications', table => {
      table.increments('id');
      table.bigInteger('recipient_user_id').unsigned().notNullable()
      .references('id').inTable('users');
      table.string('title').notNullable();
      table.text('message'); 
      table.boolean('is_read').notNullable().defaultsTo(false);
      table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};
