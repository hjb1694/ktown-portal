const knex = require('../');

const userQueries = {
    async checkIfUsernameExists(username){

        const result = await knex.count('*').from('users').where({username});

        return result;

    }, 
    async checkIfEmailExists(email){

        const result = await knex.count('*').from('users').where({email});

        return result;
    }
}

module.exports = userQueries;