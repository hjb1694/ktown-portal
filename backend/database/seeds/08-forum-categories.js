const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'seed-data', 'forum-categories.json'),'utf-8'));

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('forum_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('forum_categories').insert(data);
    });
};
