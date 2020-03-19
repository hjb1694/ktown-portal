
exports.up = function(knex) {
  return knex.schema.createTable('biz_listings_to_biz_accts', table => {
      table.increments('id');
      table.bigInteger('business_listing_id').notNullable()
      .references('id').inTable('business_listings');
      table.bigInteger('business_acct_id').notNullable()
      .references('id').inTable('business_accounts');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('biz_listings_to_biz_accts');
};
