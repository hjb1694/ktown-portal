const knex = require('../');


const messagesQueries = {
    async fetchMessageExchangeCount({user1AcctType, user1AcctId, user2AcctType, user2AcctId}){

        try{ 

            const result = await knex.count('*').as('count').from('messages').where({
                sender_acct_type : user1AcctType, 
                sender_acct_id : user1AcctId, 
                recipient_acct_type : user2AcctType, 
                recipient_acct_id : user2AcctId
            }).orWhere({
                sender_acct_type : user2AcctType, 
                sender_acct_id : user2AcctId, 
                recipient_acct_type : user1AcctType, 
                recipient_acct_id : user1AcctId
            }).select();

            return +result[0].count;

        }catch(e){
            console.log(e);

        }

    }



}

module.exports = messagesQueries;