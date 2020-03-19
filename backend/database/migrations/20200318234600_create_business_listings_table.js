
exports.up = function(knex) {
    return knex.schema.createTable('business_listings', table => {
        table.increments('id');
        table.integer('business_type').notNullable()
        .references('id').inTable('business_types');
        table.string('business_name').notNullable();
        table.string('phone');
        table.string('street_1');
        table.string('street_2');
        table.string('city');
        table.string('state',2).defaultsTo('TN');
        table.integer('zip_code',5);
        table.float('coords_lat');
        table.float('coords_lng');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('business_listings');
};
