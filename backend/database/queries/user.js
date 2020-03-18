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


    }, 
    async getLoginCredentials(email){

        try{

        const result = await knex.column('id', 'password', 'isVerified').from('users').where({email}).select();

        return result;

        }catch(e){
            console.log(e);
            throw new Error('Server failed to gather credentials');
        }

    },
    async resetPassword(userId, newPassword){

        try{

        await knex('users').update({password : newPassword}).where({id : userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to reset password.');
        }

    }
}

module.exports = userQueries;