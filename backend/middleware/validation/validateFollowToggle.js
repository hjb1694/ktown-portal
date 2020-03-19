const {check} = require('express-validator');
const {
    getUserRoleAndAccountStatusById, 
    checkIfBlocked
} = require('../../database/queries/user');

module.exports = [
    check('userToFollowUnfollow', 'Please enter a valid user ID').isInt(),
    check('userToFollowUnfollow').custom((value, {req}) => {

        if(value == req.userId)
            throw new Error('You cannot follow yourself.');

        return true;

    }), 
    check('userToFollowUnfollow').custom(async value => {

        if(value){

            const result = await getUserRoleAndAccountStatusById(value);

            if(!result.length)
                    throw new Error('This user does not exist or is no longer registered.');

            const userData = result[0];

            if(userData.accountStatus > 2)
                throw new Error('This user does not exist or is no longer registered.');

            return true;

        }


    }), 
    check('userToFollowUnfollow').custom(async (value, {req}) => {

        if(value){
            const result = await checkIfBlocked(req.userId, value);

            const count = +result[0].count;

            if(count)
                throw new Error('You have either blocked or are blocked by this user.');

            return true;
        }
    })
];