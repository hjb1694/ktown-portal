const knex = require('../');

const userQueries = {
    async checkIfUsernameExists(username){

        const result = await knex.count('*').from('users').where({username});

        return result;

    }, 
    async checkIfEmailExists(email){

        const result = await knex.count('*').from('users').where({email});

        return result;
    }, 
    async insertNewUser(userObj){

        try{

        const result = await knex('users').insert(userObj).returning('id');

        return result;

        }catch(e){
            console.log(e);
             throw new Error('User insert failed.');
        }


    }
}

module.exports = userQueries;