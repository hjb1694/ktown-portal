const knex = require('../');

const userQueries = {
    async checkIfUsernameExists(username){

        const result = await knex.count('*').from('users').where({username});

        return result;

    }, 
    async checkIfEmailExists(email){

        const result = await knex.count('*').from('users')
        .where({email}).andWhere('account_status','<',4);

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
        .from('users').where({email}).orderBy('id','DESC').limit(1).select();

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

            const result = await knex.column('account_status AS accountStatus', 'username').from('users')
            .where({id : userId}).select();

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
    async UnfollowResultingFromBlock(user1, user2){

        try{

            await knex('followers').where({
                follower_user_id : user1, 
                followed_user_id : user2
            }).orWhere({
                follower_user_id : user2, 
                followed_user_id : user1
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
    async checkIfFollowExists(followerUserId, followedUserId){

        try{

            const result = knex.count('*').from('followers')
            .where({
                follower_user_id : followedUserId, 
                followed_user_id : followedUserId
            }).select();

            if(+result[0].count) return true;
            else return false;


        }catch(e){
            console.log(e);
            throw new Error('Unable to fetch data from database');
        }

    }, 
    async unfollow(followerUserId, followedUserId){

        try{
            
            await knex('followers').where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).del();


        }catch(e){
            console.log(e);
            throw new Error('Server failed to unfollow user');
        }

    }, 
    async checkIfBlocked(blockerUserId, blockedUserId){

        try{

            const result = await knex.count('*').as('count').from('blocked_users')
            .where({
                blocker_user_id : blockerUserId, 
                blocked_user_id : blockedUserId
            }).select();

            if(+result[0].count) return true;
            else return false;

        }catch(e){
            console.log(e);
            throw new Error('Server is unable to fetch data from database.');
        }

    }, 
    async checkIfBlockedReflexive(blockerUserId, blockedUserId){

        try{

            const result = await knex.count('*').as('count').from('blocked_users')
            .where({
                blocker_user_id : blockerUserId, 
                blocked_user_id : blockedUserId
            }).orWhere({
                blocker_user_id : blockedUserId, 
                blocked_user_id : blockerUserId
            }).select();

            if(+result[0].count) return true;
            else return false;

        }catch(e){
            console.log(e);
            throw new Error('Server is unable to fetch data from database.');
        }

    },
    async insertBlockedUser(blockerUserId, blockedUserId){

        try{

            await knex('blocked_users').insert({
                blocker_user_id : blockerUserId, 
                blocked_user_id : blockedUserId
            });

        }catch(e){
            console.log(e);
            throw new Error('Server unable to block user.');
        }
    }, 
    async unblockUser(blockerUserId, blockedUserId){

        try{

            await knex('blocked_users').where({
                blocker_user_id : blockerUserId, 
                blocked_user_id : blockedUserId
            }).del();

        }catch(e){
            console.log(e);
            throw new Error('Server was unable to unblock user.');
        }

    }, 
    async checkIfFollowRequestSubmitted(followerUserId, followedUserId){

        try{

            const result = knex.count('*').as('count').from('follow_requests')
            .where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).select();

            if(+result[0].count) return true;
            else return false;

        }catch(e){
            console.log(e);
            throw new Error('Server unable to fetch data.');
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

    }, 
    async removeFollowRequest(followerUserId, followedUserId){

        try{

            await knex('follow_requests').where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).del();


        }catch(e){
            console.log(e);
            throw new Error('Server unable to remove follow request.');
        }

    }, 
    async removeFollowRequestReflexive(followerUserId, followedUserId){

        try{

            await knex('follow_requests').where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).orWhere({
                follower_user_id : followedUserId, 
                followed_user_id : followerUserId
            }).del();


        }catch(e){
            console.log(e);
            throw new Error('Server unable to remove follow requests.');
        }

    }, 
    async checkFollowRequestExists(followerUserId, followedUserId){

        try{

            const result = await knex.count('*').as('count').from('follow_requests')
            .where({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            }).select();

            if(+result[0].count) return true;
            else return false;


        }catch(e){
            console.log(e);
            throw new Error('Server failed to obtain data from database.');
        }
    },
    async insertFollow(followerUserId, followedUserId){

        try{

            await knex('followers').insert({
                follower_user_id : followerUserId, 
                followed_user_id : followedUserId
            });

        }catch(e){
            console.log(e);
            throw new Error('Server was unable to insert follow.');
        }


    }, 
    async updateAccountSettings(userId, settings){

        try{

            await knex('account_settings').update(settings).where({userId});

        }catch(e){
            console.log(e);
            throw new Error('Server unable to update account settings.');
        }


    }, 
    async removeFollowsUponAccountDeactivation(userId){

        try{

            await knex('followers').where({
                follower_user_id : userId
            }).orWhere({
                followed_user_id : userId
            }).del();

        }catch(e){
            console.log(e);
            throw new Error('Server unable to remove follows.');
        }

    }, 
    async removeFollowRequestsUponAccountDeactivation(userId){

        try{

            await knex('follow_requests').where({
                follower_user_id : userId
            }).orWhere({
                followed_user_id : userId
            }).del();

        }catch(e){
            console.log(e);
            throw new Error('Server unable to remove follow requests.');
        }

    }
}

module.exports = userQueries;