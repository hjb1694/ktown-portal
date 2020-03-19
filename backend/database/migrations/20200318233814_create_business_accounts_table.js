
exports.up = function(knex) {
  return knex.schema.createTable('business_accounts', table => {
      table.increments('id');
      table.string('email').notNullable().unique();
      table.string('name').notNullable();
      table.text('password').notNullable();
      table.integer('account_status',1).notNullable()
      .references('id').inTable('account_statuses').defaultsTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('business_accounts')
};
