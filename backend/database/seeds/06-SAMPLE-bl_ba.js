
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('biz_listings_to_biz_accts').del()
    .then(function () {
      // Inserts seed entries
      return knex('biz_listings_to_biz_accts').insert([
        {
          business_listing_id : 1, 
          business_acct_id : 1
        },
        {
          business_listing_id : 2, 
          business_acct_id : 2
        }
      ]);
    });
};
