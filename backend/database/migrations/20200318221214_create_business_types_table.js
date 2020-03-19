
exports.up = function(knex) {
  return knex.schema.createTable('business_types', table => {
    table.increments('id');
    table.string('type',100).notNullable().unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('business_types');
};
