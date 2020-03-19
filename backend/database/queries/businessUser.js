const knex = require('./');

const businessUserQueries = {
    async getLoginCredentials(email){

        try{

        const result = await knex.column('id', 'password', 'account_status', 'name')
        .from('business_accounts').where({email}).select();

        return result;

        }catch(e){
            console.log(e);
            throw new Error('Server failed to gather credentials');
        }

    }, 
    async changePassword(userId, newPassword){

        try{

        await knex('business_accounts').update({password : newPassword}).where({id : userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to change password.');
        }

    }
}