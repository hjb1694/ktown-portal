const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seed-data', 'posting-statuses.json'),'utf-8'));


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('posting_statuses').del()
    .then(function () {
      // Inserts seed entries
      return knex('posting_statuses').insert(data);
    });
};
