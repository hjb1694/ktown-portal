const {check} = require('express-validator');
const {
    getUserRoleAndAccountStatusById
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
    check('action').custom(value => {

        const opts = ['follow','unfollow'];

        if(!opts.includes(value))
            throw new Error('Please provide a valid action.');

        return true;
    })
];