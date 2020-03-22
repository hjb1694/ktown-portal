exports.up = function(knex) {
  return knex.schema.createTable('messages', table => {
      table.increments('id');
      table.enu('sender_acct_type',['general','business']).notNullable();
      table.bigInteger('sender_acct_id').notNullable();
      table.enu('recipient_acct_type',['general','business']).notNullable();
      table.bigInteger('recipient_acct_id').notNullable();
      table.timestamps(true,true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('messages');
};
