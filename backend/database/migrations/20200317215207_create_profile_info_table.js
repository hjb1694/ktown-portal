
exports.up = function(knex) {
  return knex.schema.createTable('profile_info', table => {
      table.increments('id');
      table.bigInteger('userId').unsigned().notNullable()
      .references('id').inTable('users');
      table.text('bio');
      table.string('location',25);
      table.string('occupation',25);
      table.text('hobbies');
      table.string('favrestaurant',25);
      table.string('favplacetoshop',25);
      table.text('profileImg');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('profile_info');
};
