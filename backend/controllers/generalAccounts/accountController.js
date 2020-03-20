const {validationResult} = require('express-validator');
const {
    changePassword,
    blockUnblockUser, 
    followUnfollowUser, 
    UnfollowFromBlock, 
    fetchUserSettingsById, 
    checkIfFollowRequestExists, 
    insertFollowRequest, 
    removeFollowRequest, 
    removeFollowRequestsFromBlock, 
    checkIfBlocked
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
TOGGLE BLOCK USER CONTROLLER
POST /api/v1/account/blockUnblockUser
--private--
*/

exports.blockUnblockUser = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const blockingUser = req.userId;
    const {blockedUser, action} = req.body;

    try{

        const result = await blockUnblockUser(blockingUser, blockedUser, action);

        if(action === 'block') { 
            await UnfollowFromBlock(blockingUser, blockedUser); 
            await removeFollowRequestsFromBlock(blockingUser, blockedUser);
        }

        let statusCode, status, msg; 

        if(result){
            statusCode = 201;
            status = 'success';
            msg = action === 'block' ? 'User blocked' : 'User unblocked';
        }else{
            statusCode = 422;
            status = 'error';
            msg = action === 'block' ? 'User already blocked' : 'Cannot unblock a user that has not been blocked';
        }

        res.status(statusCode).json({
            status, 
            data : {
                msg
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
TOGGLE FOLLOW USER CONTROLLER
POST /api/v1/account/followUnfollowUser
--private--
*/

exports.followUnfollowUser = async (req,res) => {

    const userFollowingUnfollowingId = req.userId;
    const {userToFollowUnfollow, action} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
                }
            });

    try{
    
        const checkIfBlockedResult = await checkIfBlocked(req.userId, userToFollowUnfollow);
    
        const checkIfBlockedCount = +checkIfBlockedResult[0].count;
    
        if(checkIfBlockedCount){
            if(action === 'unfollow'){
    
                return res.status(200).json({
                    status : 'ok', 
                    data : {
                        msg : 'You are not following this user. Note: You are either blocked by or have blocked this user.'
                    }
                });
    
            }else{
                return res.status(403).json({
                    status : 'error', 
                    data : {
                        msg : 'You are blocked by this user.'
                    }
                });
            }
        }

        const userSettingsResults = await fetchUserSettingsById(userToFollowUnfollow);

        const {isPrivate} = userSettingsResults[0];

        const followRequestExistsResults = await checkIfFollowRequestExists(userFollowingUnfollowingId, userToFollowUnfollow);

        const count = +followRequestExistsResults[0].count;

        if(isPrivate && action === 'follow'){

            if(count)
                return res.status(422).json({
                    status : 'error', 
                    data : {
                        msg : 'You have already submitted a follow request!'
                    }
                });

            await insertFollowRequest(userFollowingUnfollowingId, userToFollowUnfollow);

            return res.status(201).json({
                status : 'success', 
                data : {
                    msg : 'Follow request has been sent!'
                }
            });

        }

        if(count && action === 'unfollow'){

            await removeFollowRequest(userFollowingUnfollowingId, userToFollowUnfollow);

            return res.status(200).json({
                status : 'success', 
                data : {
                    msg : 'Follow request has been cancelled'
                }
            });

        }

    
        const followUnfollowUserResult = await followUnfollowUser(userFollowingUnfollowingId, userToFollowUnfollow, action);

        let statusCode, status, msg; 


        if(followUnfollowUserResult){
            statusCode = 201;
            status = 'success';
            msg = action === 'follow' ? 'Now following user' : 'Now unfollowing user';
        }else{
            if(action === 'follow'){
                statusCode = 422;
                status = 'error';
                msg = 'Already following user';
            }else{
                statusCode = 200;
                status = 'ok';
                msg = 'You are not following this user';
            }
        }

        res.status(statusCode).json({
            status, 
            data : {
                msg
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


exports.approveDisapproveFollowRequest = async (req,res) => {






}