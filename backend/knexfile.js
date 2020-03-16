const config = require('./config');

// Update with your config settings.

module.exports = {

  development: {
    client: config.db.client,
    connection: {
      host : config.db.host, 
      port : config.db.port, 
      user : config.db.user, 
      password : config.db.password, 
      database : config.db.dbName
    }, 
    migrations : {
      directory : './database/migrations'
    }, 
    seeds : {
      directory : './database/seeds'
    }
  }

};
