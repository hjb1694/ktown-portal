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
    removeFollowRequest
} = require('../../database/queries/user');
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
        
        const blocked = await checkIfBlocked(blockerUserId, blockedUserId);

        if(!blocked)
            return res.status(422).json({
                status : 'error', 
                msg : 'You cannot unblock a user that is not blocked!'
            });

        await unblockUser(blockerUserId, blockedUserId);

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


exports.approveFollowRequest = async (req,res) => {






}