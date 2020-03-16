
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
      table.increments('id');
      table.string('username', 25).notNullable();
      table.string('email', 100).notNullable();
      table.text('password').notNullable();
      table.date('dob').notNullable();
      table.integer('role',1).unsigned().notNullable()
      .references('id').inTable('user_roles').defaultsTo(6);
      table.boolean('isVerified').notNullable().defaultsTo(false);
      table.string('vericode').notNullable();
      table.integer('current_pts').unsigned().notNullable().defaultsTo(0);
      table.integer('lifetime_pts').unsigned().notNullable().defaultsTo(0);
      table.integer('account_status').unsigned().notNullable()
      .references('id').inTable('account_statuses').defaultsTo(1);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  