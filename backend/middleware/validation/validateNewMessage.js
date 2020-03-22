const {check} = require('express-validator');
const {sanitizeTextArea} = require('../../utils/helpers');

module.exports = [
    check('accountType').custom(value => {

        const opts = ['business','general'];

        if(!opts.includes(value))
            throw new Error('Please provide a valid account type.');

        return true;

    }), 
    check('accountId','Please provide a valid account ID').isInt(),
    check('message').custom(value => {

        value = sanitizeTextArea(value);

        if(value.length < 1 || value.length > 500 )
            throw new Error('Message must be between 1 and 500 character(s)');
            
        return true;
    })
];