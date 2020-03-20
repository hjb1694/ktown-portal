const knex = require('../');

const userProfileQueries = {
    async getUserProfileByUsername(username){

        try{

            const result = await knex.select({
                userId : 'users.id', 
                dateOfBirth : 'users.dob', 
                lifetimePoints : 'users.lifetime_pts', 
                roleId : 'users.role', 
                accountStatusId : 'users.account_status', 
                bio : 'profile_info.bio', 
                occupation : 'profile_info.occupation', 
                hobbies : 'profile_info.hobbies', 
                location : 'profile_info.location', 
                favoriteRestaurant : 'profile_info.favrestaurant', 
                favoritePlaceToShop : 'profile_info.favplacetoshop', 
                profileImg : 'profile_info.profileImg', 
                accountPrivate : 'account_settings.isPrivate'
            })
            .from('users')
            .join('profile_info', 'users.id', 'profile_info.userId')
            .join('account_settings', 'users.id', 'account_settings.userId')
            .where({'users.username' : username});

            return result;

        }catch(e){
            console.log(e);

            throw new Error('Server unable to obtain information profile from database');

        }

    }
}


module.exports = userProfileQueries;