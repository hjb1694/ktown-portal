const fs = require('fs');
const path = require('path');

const roleData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seed-data', 'user-roles.json'),'utf-8'));


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_roles').insert(roleData);
    });
};
