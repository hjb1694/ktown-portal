const {check} = require('express-validator');
const {
    sanitizeTextField, 
    sanitizeTextArea
} = require('../../utils/helpers');
const {getCategories} = require('../../database/queries/forumPosts');

module.exports = [
    check('headline', 'Please provide a valid headline').isString(), 
    check('headline').custom(value => {

        value = sanitizeTextField(value);

        if(value.length < 15 || value.length > 150){

            throw new Error('Headline must be between 15 and 150 characters.');

        }

        return true;
    }), 
    check('content', 'Please provide valid content.').isString(),
    check('content').custom(value => {

        value = sanitizeTextArea(value);

        if(value.length < 50){

            throw new Error('Please provide more text content in your post.');

        }

        return true;

    }), 
    check('category', 'Please provide a valid category ID').isInt(), 
    check('category').custom(async value => {

        const cats = await getCategories();

        const catIds = cats.map(item => item.id);

        if(!catIds.includes(value))
            throw new Error('Invalid category ID');

        return true;

    })
];