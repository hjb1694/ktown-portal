
exports.up = function(knex) {
  return knex.schema.createTable('account_settings', table => {
    table.increments('id');
    table.bigInteger('userId').unsigned().notNullable()
    .references('id').inTable('users');
    table.boolean('isPrivate').notNullable().defaultsTo(false);
    table.boolean('sendEmailNewMessage').notNullable().defaultsTo(true);
    table.boolean('sendMessageReplies').notNullable().defaultsTo(true);
    table.boolean('allowMentions').notNullable().defaultsTo(true);
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('account_settings');
};
