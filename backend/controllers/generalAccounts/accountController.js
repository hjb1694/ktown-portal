const {validationResult} = require('express-validator');
const {
    changePassword,
    blockUnblockUser, 
    followUnfollowUser, 
    UnfollowFromBlock
} = require('../database/queries/user');
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

        if(action === 'block') await UnfollowFromBlock(blockingUser, blockedUser);

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

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

        const userFollowingUnfollowingId = req.userId;
        const {userToFollowUnfollow, action} = req.body;
    
        try{
    
            const result = await followUnfollowUser(userFollowingUnfollowingId, userToFollowUnfollow, action);
    
            let statusCode, status, msg; 
    
    
            if(result){
                statusCode = 201;
                status = 'success';
                msg = action === 'follow' ? 'Now following user' : 'Now unfollowing user';
            }else{
                statusCode = 422;
                status = 'error';
                msg = action === 'follow' ? 'Already following user' : 'Cannot unfollow a user that has not been followed';
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