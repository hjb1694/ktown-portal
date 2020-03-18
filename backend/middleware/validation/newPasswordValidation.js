const {check} = require('express-validator');

module.exports = [
    check('newPassword').custom(value => {

        const regs = {
            uppercase : /[A-Z]/g, 
            lowercase : /[a-z]/g, 
            number : /[0-9]/g
        }

        if(
            !regs.uppercase.test(value) ||
            !regs.lowercase.test(value) ||
            !regs.number.test(value) ||
            value.length < 8 ||
            value.length > 25
        ) throw new Error('Password must be between 8 and 25 characters, contain at least 1 uppercase letter, contain at least \
        1 lowercase letter, and contain at least 1 number.');

        return true;


    })
];