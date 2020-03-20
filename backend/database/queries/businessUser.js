const knex = require('../');

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

    }, 
    async checkAccountStatus(userId){

        try{

            const result = await knex.column('account_status AS accountStatus', 'name').from('business_accounts').where({id : userId}).select();

            return result;


        }catch(e){
            console.log(e);
            throw new Error('Server failed to check user\'s account status.');
        }

    },  
    async getBusinessListingsByUserId(userId){

        try{

            const result = knex.column('business_listing_id').from('biz_listings_to_biz_accts')
            .where({business_acct_id : userId}).select();

            return result;


        }catch(e){
            console.log(e);
            throw new Error('Server failed to fetch business IDs');
        }


    }
}

module.exports = businessUserQueries;