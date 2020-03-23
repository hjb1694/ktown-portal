const knex = require('../');

const notifsQueries = {
    async insertNotification(recipientAcctType, recipientAcctId, title, message = null){

        try{
            
            if(recipientAcctType === 'general'){

                await knex('notifications').insert({
                    recipient_user_id : recipientAcctId, 
                    title, 
                    message
                });

            }else if(recipientAcctType === 'business'){

                await knex('biz_notifications').insert({
                    recipient_acct_id : recipientAcctId, 
                    title, 
                    message
                });

            }else{
                throw new Error('Please provide a correct account type.');
            }

        }catch(e){
            console.log(e);
            throw new Error('Server unable to insert notification.');
        }

    }
}


module.exports = notifsQueries;