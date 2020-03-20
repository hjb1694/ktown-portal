const knex = require('../');

const userQueries = {
    async checkIfUsernameExists(username){

        const result = await knex.count('*').from('users').where({username});

        return result;

    }, 
    async checkIfEmailExists(email){

        const result = await knex.count('*').from('users').where({email});

        return result;
    }, 
    async insertNewUser(userObj){

        try{

        const result = await knex('users').insert(userObj).returning('id');

        return result;

        }catch(e){
            console.log(e);
             throw new Error('User insert failed.');
        }


    }, 
    async getLoginCredentials(email){

        try{

        const result = await knex.column('id', 'password', 'isVerified', 'account_status', 'username')
        .from('users').where({email}).select();

        return result;

        }catch(e){
            console.log(e);
            throw new Error('Server failed to gather credentials');
        }

    },
    async changePassword(userId, newPassword){

        try{

        await knex('users').update({password : newPassword}).where({id : userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to change password.');
        }

    }, 
    async insertAccountSettings(userId){

        try{

            await knex('account_settings').insert({userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to insert account settings.');
        }

    }, 
    async insertProfileInfo(userId){

        try{

            await knex('profile_info').insert({userId});


        }catch(e){
            console.log(e);
            throw new Error('Server failed to insert profile info.');
        }


    },
    async checkAccountStatus(userId){

        try{

            const result = await knex.column('account_status AS accountStatus', 'username').from('users').where({id : userId}).select();

            return result;


        }catch(e){
            console.log(e);
            throw new Error('Server failed to check user\'s account status.');
        }

    }, 
    async getUserRoleAndAccountStatusById(userId){

        try{

            const result = await knex.column('role','account_status AS accountStatus')
            .from('users').where({id : userId}).select();

            return result;


        }catch(e){
            console.log(e);
            throw new Error('Server unable to obtain information from database.');
        }

    },
    async blockUnblockUser(blockingUserId, blockedUserId, action){

        try{

            const result = await knex.count('*').from('blocked_users').where({
                blocking_user_id : blockingUserId, 
                blocked_user_id : blockedUserId
            }).select();

            if(action === 'block'){

                if(+result[0].count === 0){

                    await knex('blocked_users').insert({
                        blocking_user_id : blockingUserId, 
                        blocked_user_id : blockedUserId
                    });

                    return true;

                }else{
                    return false;
                }
    
            }else if(action === 'unblock'){
    
                if(+result[0].count === 1){

                    await knex('blocked_users').where({
                        blocking_user_id : blockingUserId, 
                        blocked_user_id : blockedUserId
                    }).del();

                    return true;

                }else{
                    return false;
                }
    
            }


        }catch(e){
            console.log(e);
            throw new Error('Server failed to block or unblock user.');
        }

    }, 
    async checkIfBlocked(user1, user2){

        try{

            const result = await knex.count('*').from('blocked_users').where({
                blocking_user_id : user1, 
                blocked_user_id : user2
            }).orWhere({
                blocking_user_id : user2, 
                blocked_user_id : user1
            });

            return result;

        }catch(e){
            console.log(e);
            throw new Error('Failed to fetch from database.');
        }


    }, 
    async followUnfollowUser(userFollowingUnfollowingId, userToFollowUnfollowId, action){

        try{

            const result = await knex.count('*').from('followers').where({
                follower_user_id : userFollowingUnfollowingId, 
                following_user_id : userToFollowUnfollowId
            }).select();

            if(action === 'follow'){

                if(+result[0].count === 0){

                    await knex('followers').insert({
                        follower_user_id : userFollowingUnfollowingId, 
                        following_user_id : userToFollowUnfollowId
                    });

                    return true;

                }else{
                    return false;
                }
    
            }else if(action === 'unfollow'){
    
                if(+result[0].count === 1){

                    await knex('followers').where({
                        follower_user_id : userFollowingUnfollowingId, 
                        following_user_id : userToFollowUnfollowId
                    }).del();

                    return true;

                }else{
                    return false;
                }
    
            }


        }catch(e){
            console.log(e);
            throw new Error('Server failed to follow or unfollow user.');
        }

    }, 
    async UnfollowFromBlock(user1, user2){

        try{

            await knex('followers').where({
                follower_user_id : user1, 
                following_user_id : user2
            }).orWhere({
                follower_user_id : user2, 
                following_user_id : user1
            }).del();


        }catch(e){
            console.log(e);
            throw new Error('Server failed to unfollow users.');
        }

    }, 
    async fetchUserSettingsById(userId){

        try{

            const result = knex.select('*').from('account_settings').where({userId});

            return result;

        }catch(e){

            console.log(e);
            throw new Error('Server failed to fetch account settings for user.');

        }

    }, 
    async checkIfFollowRequestExists(followerUserId, followedUserId){

        try{

            const result = await knex.count('*').as('count').from('follow_requests').where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).select();

            return result;

        }catch(e){
            console.log(e);
            throw new Error('Server unable to obtain information from database.');
        }

    }, 
    async insertFollowRequest(followerUserId, followedUserId){

        try{

            await knex('follow_requests').insert({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            });

        }catch(e){
            console.log(e);
            throw new Error('Server unable to insert follow request into database.');
        }


    }
}

module.exports = userQueries;