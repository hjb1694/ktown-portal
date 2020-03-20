const knex = require('../');

module.exports = {
    async insertAnnouncement({listingId, headline, details}){

        try{

            await knex('business_announcements').insert({
                business_listing_id : listingId, 
                headline, 
                details, 
                posting_status : 1
            });

        }catch(e){
            console.log(e);
            throw new Error('The server was unable to insert new announcement.');
        }

    }


}