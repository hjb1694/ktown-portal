const {check} = require('express-validator');
const {getBusinessListingsByUserId} = require('../../database/queries/businessUser');
const {
    sanitizeTextField, 
    sanitizeTextArea
} = require('../../utils/helpers');

module.exports = [
    check('businessListingId', 'Please enter a valid business listing ID.').isInt(), 
    check('businessListingId').custom(async (value, {req}) => {

        const result = await getBusinessListingsByUserId(req.userId);

        const listingIds = result.map(listing => +listing.business_listing_id);

        if(!listingIds.includes(+value))
            throw new Error('You do not have any listings with this listing ID.');

        return true;

    }), 
    check('headline', 'Headline must be a string.').isString(),
    check('headline').custom(value => {

        value = sanitizeTextField(value);

        if(value.length < 10 || value.length > 50)
            throw new Error('Headline must be between 10 and 50 characters long.');

        return true;

    }), 
    check('details', 'Details must be a string.').isString(), 
    check('details').custom(value => {

        value = sanitizeTextArea(value);

        if(value.length < 50 || value.length > 1000)
            throw new Error('Details must be between 50 and 1,000 characters.');

        return true;

    })
];