exports.up = function(knex) {
    return knex.schema.createTable('biz_notifications', table => {
        table.increments('id');
        table.bigInteger('recipient_acct_id').unsigned().notNullable()
        .references('id').inTable('business_accounts');
        table.string('title').notNullable();
        table.text('message'); 
        table.boolean('is_read').notNullable().defaultsTo(false);
        table.timestamps();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('biz_notifications');
  };
