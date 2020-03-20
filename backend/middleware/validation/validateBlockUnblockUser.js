const {check} = require('express-validator');
const {getUserRoleAndAccountStatusById} = require('../../database/queries/user');

module.exports = [
    check('userId', 'Please provide a valid user id').isInt(),
    check('userId').custom((value, {req}) => {
        if(value == req.userId)
            throw new Error(`The user id you are attempting to ${req.action} cannot be the same as your\'s.`);
        
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

            if(userData.role < 3)
                throw new Error('You cannot block or unblock staff or administrators.');

            return true;

        }
    })
];