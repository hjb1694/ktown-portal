const {check} = require('express-validator');
const knex = require('../../database');
const {sanitizeTextField} = require('../../utils/helpers');
const moment = require('moment');
const {
    checkIfUsernameExists, 
    checkIfEmailExists
} = require('../../database/queries/user');

module.exports = [
    check('username').custom(value => {

        value = sanitizeTextField(value);

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
    }), 
    check('username').custom(async value => {

        const result = await checkIfUsernameExists(value);

        const count = +result[0].count;

        if(count)
            throw new Error('This username already exists!');

        return true;


    }), 
    check('email', 'Please enter a valid email address.').trim().isEmail(), 
    check('email').custom(async value => {

        const result = await checkIfEmailExists(value);

        const count = +result[0].count;

        if(count)
            throw new Error('This email address already exists!');

        return true;

    }), 
    check('password').custom(value => {

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


    }), 
    check('dob').custom(value => {

        const dob = moment(value, 'YYYY-MM-DD');

        if(!dob.isValid())
            throw new Error('Please enter a valid birth date.');

        return true;


    }), 
    check('dob').custom(value => {

        const dob = moment(value, 'YYYY-MM-DD');

        const diff = moment().diff(dob, 'years');

        if(diff < 13)
            throw new Error('You must be at least 13 years old to join.');

        return true;


    })
];