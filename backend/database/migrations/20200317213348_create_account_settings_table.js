
exports.up = function(knex) {
  return knex.schema.createTable('account_settings', table => {
    table.increments('id');
    table.bigInteger('userId').unsigned().notNullable()
    .references('id').inTable('users');
    table.boolean('is_private').notNullable().defaultsTo(false);
    table.boolean('send_email_new_message').notNullable().defaultsTo(true);
    table.boolean('send_email_on_replies').notNullable().defaultsTo(true);
    table.boolean('allow_mentions').notNullable().defaultsTo(true);
    table.boolean('messages_from_followers_only').notNullable().defaultsTo(false);
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('account_settings');
};
