const bcrypt = require('bcryptjs');

const hashedPassword = bcrypt.hashSync('password', 8);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('business_accounts').del()
    .then(function () {
      // Inserts seed entries
      return knex('business_accounts').insert([
        {
          email : 'jonWu@samplewebsite.com', 
          name : 'Jon Wu', 
          password : hashedPassword
        },
        {
          email : 'Tim.Wagner@store.com', 
          name : 'Tim Wagner', 
          password : hashedPassword
        }
      ]);
    });
};
