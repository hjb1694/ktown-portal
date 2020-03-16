require('dotenv').config();

module.exports = {
    db : {
        host : process.env.DB_HOST || '127.0.0.1', 
        port : process.env.DB_PORT || 5432, 
        user : process.env.DB_USER || 'postgres', 
        password : process.env.DB_PASSWORD || 'password', 
        dbName : process.env.DB_NAME || 'ktown', 
        client : process.env.DB_CLIENT || 'pg'
    }
}