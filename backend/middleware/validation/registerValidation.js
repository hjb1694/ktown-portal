const {check} = require('express-validator');
const knex = require('../../database');
const {sanitizeTextField} = require('../../utils/helpers');

module.exports = [
    check('username').custom(value => {

        value = sanitizeTextField(value);

        console.log(value);

        let regs = {
            spaces : /\s+/g,
            lettersOrNums : /[A-Z0-9]+/gi
        }

        if(
            regs.spaces.test(value) || 
            !regs.lettersOrNums.test(value) ||
            value.length < 4 ||
            value.length > 16
        ) throw new Error('Username must contain only letters or numbers with no spaces AND be between 4 to 16 characters');

        return true;
    })
];