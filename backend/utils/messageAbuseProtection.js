const {
    fetchLast3MessageExchanges
} = require('../database/queries/messages');

module.exports = async (senderAcctType, senderAcctId, recipientAcctType, recipientAcctId) => {

    try{

        let errors = [];

        const exchanges = await fetchLast3MessageExchanges(
            senderAcctType, 
            senderAcctId, 
            recipientAcctType, 
            recipientAcctId
        );

        if(exchanges.length >= 3){

            const theSame = exchanges.map(item => +item.senderAcctId).every((item, index, arr) => item === arr[0]);

            if(theSame){
                errors.push({msg : 'Please wait for the recipient to respond.'});
            }

        }

        return errors;

    }catch(e){
        console.log(e);
        throw new Error('Message abuse protection function failed.');
    }

}