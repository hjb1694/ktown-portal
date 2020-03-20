
exports.up = function(knex) {
  return knex.schema.createTable('business_announcements', table => {
      table.increments('id');
      table.bigInteger('business_listing_id').notNullable()
      .references('id').inTable('business_listings');
      table.string('headline', 50).notNullable();
      table.text('details');
      table.integer('posting_status').notNullable()
      .references('id').inTable('posting_statuses').defaultsTo(1);
      table.timestamps(true,true);
  });
};

exports.down = function(knex) {
  return knex.schema.removeTable('business_announcements');
};
