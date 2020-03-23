const {validationResult} = require('express-validator');
const {
    checkAccountStatus, 
    checkIfBlockedReflexive, 
    fetchUserSettingsById, 
    getUserRoleAndAccountStatusById
} = require('../database/queries/user');
const {
    fetchMessageExchangeCount
} = require('../database/queries/messages');


/*
SEND MESSAGE CONTROLLER
POST /api/v1/messages/
--private--
*/

exports.sendMessage = async (req,res) => {

    // To get to this controller, the account status has already been obtained and it has been 
    // determined that the sender is not frozen and his/her account exists (has not been suspended or deactivated).
    // Also, input has already underwent a validation process.

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

    try{

        // Fetching the count of messages exchanged between the sender and recipient.
        const messagesExchangedCount = await fetchMessageExchangeCount({
            user1AcctType : senderAcctType, 
            user1AcctType : senderAcctType, 
            user2AcctType : recipientAcctType, 
            user2AcctId : recipientAcctId
        });


        if(recipientAcctType === 'general'){

            // Checking of the recipient of the account type "general" has an existing account. 
            // If the account is deactivated, suspended, or never existed in the first place, then 
            // an error is returned.
            const stat = await checkAccountStatus(recipientAcctId)[0];

            if(!stat || stat.accountStatus > 2)
                return res.status(422).json({
                    status : 'error', 
                    data : {
                        msg : 'This user does not exist or is no longer a registered user.'
                    }
                });

            if(senderAcctType === 'general'){

                // Get sender's role if the account type is "general"
                const {
                    role
                } = await getUserRoleAndAccountStatusById(senderAcctId)[0];


                // If the role of the sender is not of "admin" or "staff", perform actions in the if block below.
                // "Admin" or "Staff" cannot be blocked by any user and do not have to be followers of the user to
                // send messages.
                if(role > 2){

                    const blocked = await checkIfBlockedReflexive(recipientAcctId, senderAcctId);

                    if(blocked)
                        return res.status(403).json({
                            status : 'error', 
                            data : {
                                msg : 'You are either blocked by this user or have blocked this user.'
                            }
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

            }


        }else if(accountType === 'business'){

            //come back to later

        }

        //Send message

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'A server error has occurred.'
            }
        });
    }

}