exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('business_listings').del()
    .then(function () {
      // Inserts seed entries
      return knex('business_listings').insert([
        {
          business_type : 1, 
          business_name : 'Wok House', 
          phone : '555-555-5555', 
          street_1 : '123 Wok Way', 
          street_2 : 'Suite 101', 
          city : 'Farragut', 
          zip_code : 37922
        },
        {
          business_type : 2, 
          business_name : 'The Athlete Store', 
          phone : '777-777-777', 
          street_1 : '101 Park Avenue', 
          street_2 : 'Building 5', 
          city : 'Knoxville', 
          zip_code : 37931
        }
      ]);
    });
};
