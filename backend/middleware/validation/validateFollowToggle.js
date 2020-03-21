const {check} = require('express-validator');
const {
    getUserRoleAndAccountStatusById
} = require('../../database/queries/user');

module.exports = [
    check('userId', 'Please enter a valid user ID').isInt(),
    check('userId').custom((value, {req}) => {

        if(value == req.userId)
            throw new Error('You cannot follow or unfollow yourself.');

        return true;

    }), 
    check('userId').custom(async value => {

        if(value){

            const result = await getUserRoleAndAccountStatusById(value);

            if(!result.length)
                    throw new Error('This user does not exist or is no longer registered.');

            const userData = result[0];

            if(userData.accountStatus > 2)
                throw new Error('This user does not exist or is no longer registered.');

            return true;

        }
    })
];