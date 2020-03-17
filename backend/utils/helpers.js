const config = require('../config');
const sanitizer = require('sanitize-html');
const HtmlEntities = require('html-entities').AllHtmlEntities;
const jtw = require('jsonwebtoken');
htmlEntities = new HtmlEntities();

const helpers = {
    stripTags(value){
        return sanitizer(value, {
            allowedTags : [], 
            allowedAttributes : {}
        });
    }, 
    htmlEntitiesDecode(value){
        return htmlEntities.decode(value);
    }, 
    stripExcessWhitespaceTextField(value){
        return value.replace(/ {2,}/g, ' ').replace(/\n+/g, ' ');
    }, 
    sanitizeTextField(value){
        return helpers.stripExcessWhitespaceTextField(helpers.stripTags(helpers.htmlEntitiesDecode(value))).trim();
    }, 
    signToken(userId, isVerified){

        return jtw.sign({
            userId, 
            isVerified
        }, config.jwt_secret, {
            expiresIn : '1 hour'
        });
        

    }
}

module.exports = helpers;