const knex = require('knex');
const config = require('./knexfile')
// const environment = 'development';

const db = knex(config[process.env.NODE_ENV]);
module.exports = db;
