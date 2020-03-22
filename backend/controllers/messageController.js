const {validationResult} = require('express-validator');
const {
    checkAccountStatus, 
    checkIfBlockedReflexive, 
    fetchUserSettingsById
} = require('../database/queries/user');
const {
    fetchMessageExchangeCount
} = require('../database/queries/messages');


exports.sendMessage = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const {accountType : recipientAcctType, accountId : recipientAcctId, message} = req.body;
    const senderAcctType = req.accountType;
    const senderAcctId = req.userId;

    if(recipientAcctType === 'general'){

        const stat = await checkAccountStatus(accountId)[0];

        if(!stat || stat.accountStatus > 1)
            return res.status(422).json({
                status : 'error', 
                data : {
                    msg : 'This user does not exist or is no longer a registered user.'
                }
            });

        if(req.accountType === 'general'){

            const blocked = await checkIfBlockedReflexive(accountId, req.userId);

            if(blocked)
                return res.status(403).json({
                    status : 'error', 
                    data : {
                        msg : 'You are either blocked by this user or have blocked this user.'
                    }
                });

            const messagesExchangedCount = await fetchMessageExchangeCount({
                user1AcctType : senderAcctType, 
                user1AcctType : senderAcctType, 
                user2AcctType : recipientAcctType, 
                user2AcctId : recipientAcctId
            });

            const {
                messages_from_followers_only : messagesFromFollowersOnly,
                is_private : isPrivate} = await fetchUserSettingsById({userId : recipientAcctId})[0];

            if((messagesFromFollowersOnly || isPrivate) && !messagesExchangedCount)
                return res.status(403).json({
                    status : 'error', 
                    data : {
                        msg : 'This user only accepts messages from followers only.'
                    }
                });

        }


    }else if(accountType === 'business'){

        //come back to later

    }

    //Send message

}