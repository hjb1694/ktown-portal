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

        const result = await knex.column('id', 'password', 'isVerified', 'account_status', 'username')
        .from('users').where({email}).select();

        return result;

        }catch(e){
            console.log(e);
            throw new Error('Server failed to gather credentials');
        }

    },
    async changePassword(userId, newPassword){

        try{

        await knex('users').update({password : newPassword}).where({id : userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to change password.');
        }

    }, 
    async insertAccountSettings(userId){

        try{

            await knex('account_settings').insert({userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to insert account settings.');
        }

    }, 
    async insertProfileInfo(){

        try{

            await knex('profile_info').insert({userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to insert profile info.');
        }


    }
}

module.exports = userQueries;