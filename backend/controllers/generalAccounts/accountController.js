const {validationResult} = require('express-validator');
const {
    changePassword, 
    checkIfBlocked, 
    checkIfBlockedReflexive,
    insertBlockedUser, 
    unblockUser, 
    UnfollowResultingFromBlock, 
    checkIfFollowRequestSubmitted,
    insertFollowRequest, 
    unfollow, 
    removeFollowRequest, 
    removeFollowRequestReflexive, 
    checkFollowRequestExists, 
    insertFollow, 
    updateAccountSettings, 
    removeFollowRequestsUponAccountDeactivation, 
    removeFollowsUponAccountDeactivation
} = require('../../database/queries/user');
const {
    insertNotification
} = require('../../database/queries/notifs');
const bcrypt = require('bcryptjs');

/*
CHANGE PASSWORD CONTROLLER
POST /api/v1/account/changePassword
--private--
*/

exports.changePassword = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error',
            data : {
                errors : errors.array()
            }
        });

    const {userId} = req;
    const {newPassword} = req.body;

    try{

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        await changePassword(userId, hashedPassword);

        res.status(200).json({
            status : 'success', 
            data : {
                msg : 'Password changed successfully.'
            }
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'An server error has occurred.'
            }
        });

    }

}

/*
BLOCK USER CONTROLLER
POST /api/v1/account/blockUser
--private--
*/

exports.blockUser = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const blockerUserId = req.userId;
    const {userId : blockedUserId} = req.body;

    try{

        const blocked = await checkIfBlocked(blockerUserId, blockedUserId);

        if(blocked)
            return res.status(422).json({
                status : 'error', 
                msg : 'You have already blocked this user!'
            });

        
        await insertBlockedUser(blockerUserId, blockedUserId);
        await UnfollowResultingFromBlock(blockerUserId, blockedUserId);
        await removeFollowRequestReflexive(blockerUserId, blockedUserId);

        res.status(201).json({
            status : 'success',
            data : {
                msg : 'This user is now blocked!'
            }
        });   

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error',
            data : {
                msg : 'A server error has occurred'
            }
        });
    }

}

/*
UNBLOCK USER CONTROLLER
POST /api/v1/account/unblockUser
--private--
*/


exports.unblockUser = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const unblockerUserId = req.userId;
    const {userId : unblockedUserId} = req.body;

    try{   
        
        const blocked = await checkIfBlocked(unblockerUserId, unblockedUserId);

        if(!blocked)
            return res.status(422).json({
                status : 'error', 
                msg : 'You cannot unblock a user that is not blocked!'
            });

        await unblockUser(unblockerUserId, unblockedUserId);

        res.status(201).json({
            status : 'success',
            data : {
                msg : 'This user is now unblocked!'
            }
        });
      


    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error',
            data : {
                msg : 'A server error has occurred'
            }
        });
    }
}

/*
FOLLOW USER CONTROLLER
POST /api/v1/account/followUser
--private--
*/

exports.followUser = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
                }
            });

    const followerUserId = req.userId;
    const {userId : followedUserId} = req.body;

    try{

        const following = await checkIfFollowExists(followerUserId, followedUserId);

        if(following)
            return res.status(422).json({
                status : 'error',
                data : {
                    msg : 'You are already following this user.'
                }
            });

        const blocked = await checkIfBlockedReflexive(followerUserId, followerUserId);

        if(blocked)
            return res.status(403).json({
                status : 'error', 
                data : {
                    msg : 'You have either blocked this user of have been blocked by this user.'
                }
            });

        const requestExists = await checkIfFollowRequestSubmitted(followedUserId, followedUserId);

        if(requestExists)
            return res.status(422).json({
                status : 'error', 
                data : {
                    msg : 'A follow request has already been submitted.'
                }
            });

        
        await insertFollowRequest(followerUserId, followedUserId);
        await insertNotification(
            followedUserId, 
            `${req.username} has requested to follow you!`
            );

        res.status(201).json({
            status : 'success', 
            data : {
                msg : 'A follow request has been sent!'
            }
        });
        

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

/*
UNFOLLOW USER CONTROLLER
DELETE /api/v1/account/unfollowUser
--private--
*/

exports.unfollowUser = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
                }
            });

    const unfollowerUserId = req.userId;
    const {userId : unfollowedUserId} = req.body;


    try{

        await unfollow(unfollowerUserId, unfollowedUserId);
        await removeFollowRequest(unfollowerUserId, unfollowedUserId);

        res.json({
            status : 'ok', 
            data : {
                msg : 'If you had a follow request or had followed this user, you no longer.'
            }
        });

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

/*
APPROVE FOLLOW REQUEST CONTROLLER
POST /api/v1/account/approveFollowRequest
--private--
*/


exports.approveFollowRequest = async (req,res) => {

    const {followerUserId} = req.body;
    const followedUserId = req.userId;

    try{

        const requestExists = await checkFollowRequestExists(followerUserId, followedUserId);

        if(!requestExists)
            res.status(422).json({
                status : 'error', 
                data : {
                    msg : 'Follow request was rescinded or doesn\'t exist'
                }
            });

        await insertFollow(followerUserId, followedUserId);
        await removeFollowRequest(followerUserId, followedUserId);
        await insertNotification(followerUserId, `${req.username} has approved your follow request.`);

        res.status(200).json({
            status : 'success', 
            data : {
                msg : 'You are now followed by this user.'
            }
        });
        


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

/*
REJECT FOLLOW REQUEST CONTROLLER
DELETE /api/v1/account/rejectFollowRequest
--private--
*/

exports.rejectFollowRequest = async (req,res) => {

    const {followerUserId} = req.body;
    const followedUserId = req.userId;

    try{

        await removeFollowRequest(followerUserId, followedUserId);

        res.status(200).json({
            status : 'ok'
        });


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

/*
UPDATE ACCOUNT SETTINGS CONTROLLER
PATCH /api/v1/account/accountSettings
--private--
*/

exports.updateAccountSettings = async (req,res) => {

    const acceptedFields = {
        isPrivate : [true,false], 
        sendEmailNewMessage : [true,false], 
        sendEmailOnReplies : [true,false], 
        allowMentions : [true,false]
    };

    let hasUnnacceptableField = false;

    for(let key in req.body){
        if(
            !Object.keys(acceptedFields).includes(key) ||
            !acceptedFields[key].includes(req.body[key])
        ){
            hasUnnacceptableField = true;
            break;
        }
    }

    if(hasUnnacceptableField)
        return res.status(422).json({
            status : 'error', 
            data : {
                msg : 'Unacceptable field'
            }
        });

    try{

        await updateAccountSettings(req.userId, req.body);

        res.status(200).json({
            status : 'success', 
            data : {
                msg : 'Account settings successfully changed!'
            }
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'A server error occurred.'
            }
        });
    }

}

/*
DEACTIVATE ACCOUNT CONTROLLER
PATCH /api/v1/account/deactivateAccount
--private--
*/

exports.deactivateAccount = async (req,res) => {

    try {

        await changeAccountStatus(req.userId, 4);
        await removeFollowRequestsUponAccountDeactivation(req.userId);
        await removeFollowsUponAccountDeactivation(req.userId);

        res.status(200).json({
            status : 'ok', 
            data : {
                msg : 'You account has been successfully deactivated.'
            }
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'A server error has occurrred.'
            }
        });
    }

}