const knex = require('../');

const notifsQueries = {
    async insertNotification(recipientUserId, title, message = null){

        try{

            await knex('notifications').insert({
                recipient_user_id : recipientUserId, 
                title, 
                message
            });

        }catch(e){
            console.log(e);
            throw new Error('Server unable to insert notification.');
        }

    }
}


module.exports = notifsQueries;