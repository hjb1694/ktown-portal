const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seed-data', 'business-types.json'),'utf-8'));


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('business_types').del()
    .then(function () {
      // Inserts seed entries
      return knex('business_types').insert(data);
    });
};
