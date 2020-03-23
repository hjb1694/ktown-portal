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

    }, 
    async insertMessage({senderAcctType, senderAcctId, recipientAcctType, recipientAcctId, message}){

        try{

            await knex('messages').insert({
                sender_acct_type : senderAcctType, 
                sender_acct_id : senderAcctId, 
                recipient_acct_type : recipientAcctType, 
                recipient_acct_id : recipientAcctId, 
                message
            });

        }catch(e){
            console.log(e);
            throw new Error('A server error has occurred.');
        }

    },
    async fetchLast3MessageExchanges(user1AcctType, user1AcctId, user2AcctType, user2AcctId){

        try{

            const result = await knex.select('id','sender_acct_id AS senderAcctId','recipient_acct_id AS recipientAcctId')
            .from('messages').where({
                sender_acct_type : user1AcctType, 
                sender_acct_id : user1AcctId, 
                recipient_acct_type : user2AcctType, 
                recipient_acct_id : user2AcctId
            }).orWhere({
                sender_acct_type : user2AcctType, 
                sender_acct_id : user2AcctId, 
                recipient_acct_type : user1AcctType, 
                recipient_acct_id : user1AcctId
            }).orderBy('id','DESC').limit(3);

            return result;


        }catch(e){
            console.log(e);
            throw new Error('Server unable to obtain data.');
        }


    }



}

module.exports = messagesQueries;