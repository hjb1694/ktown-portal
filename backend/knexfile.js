const config = require('./config');

// Update with your config settings.

module.exports = {
  // Development
  development: {
    client: config.db.dev.client,
    connection: {
      host : config.db.dev.host, 
      port : config.db.dev.port, 
      user : config.db.dev.user, 
      password : config.db.dev.password, 
      database : config.db.dev.dbName
    }, 
    migrations : {
      directory : './database/migrations'
    }, 
    seeds : {
      directory : './database/seeds'
    }
  }, 
  // Testing
  test : {
    client: config.db.test.client,
    connection: {
      host : config.db.test.host, 
      port : config.db.test.port, 
      user : config.db.test.user, 
      password : config.db.test.password, 
      database : config.db.test.dbName
    }, 
    migrations : {
      directory : './database/migrations'
    }, 
    seeds : {
      directory : './database/seeds'
    }
  }
};
