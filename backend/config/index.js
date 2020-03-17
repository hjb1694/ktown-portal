const path = require('path');
require('dotenv').config({
    path : path.join(__dirname, '..', '.env')
});

module.exports = {
    env : process.env.NODE_ENV || 'development',
    port : process.env.PORT || 8081,
    db : {
        dev : {
            host : process.env.DB_DEV_HOST || '127.0.0.1', 
            port : process.env.DB_DEV_PORT || 5432, 
            user : process.env.DB_DEV_USER || 'postgres', 
            password : process.env.DB_DEV_PASSWORD || 'password', 
            dbName : process.env.DB_DEV_NAME || 'ktowndev', 
            client : process.env.DB_DEV_CLIENT || 'pg'
        }, 
        test : {
            host : process.env.DB_TEST_HOST || '127.0.0.1', 
            port : process.env.DB_TEST_PORT || 5432, 
            user : process.env.DB_TEST_USER || 'postgres', 
            password : process.env.DB_TEST_PASSWORD || 'password', 
            dbName : process.env.DB_TEST_NAME || 'ktowntest', 
            client : process.env.DB_TEST_CLIENT || 'pg'
        }
    }, 
    jwt_secret : process.env.JWT_SECRET || 'secret', 
    nodemailer : {
        host : process.env.NODEMAILER_HOST || 'smtp.ethereal.email', 
        port :  process.env.NODEMAILER_PORT || 587, 
        user : process.env.NODEMAILER_USER, 
        pass : process.env.NODEMAILER_PASS
    }
}