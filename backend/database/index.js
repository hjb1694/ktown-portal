const config = require('../config');
const knexfile = require('../knexfile');
const knex = require('knex')(knexfile[config.env]);
module.exports = knex;

