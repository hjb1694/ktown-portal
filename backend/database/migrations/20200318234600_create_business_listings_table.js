
exports.up = function(knex) {
    return knex.schema.createTable('business_listings', table => {
        table.increments('id');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('business_listings');
};
