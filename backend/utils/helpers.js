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
        return value.replace(/ {2,}/g, ' ').replace(/\t+/gm, ' ').replace(/\n+/gm, ' ');
    }, 
    stripExcessWhitespaceTextArea(value){
        return value.replace(/ {2,}/gm, ' ').replace(/\t+/gm, ' ').replace(/\n{3,}/gm, '\n\n');
    },
    sanitizeTextField(value){
        return helpers.stripExcessWhitespaceTextField(helpers.stripTags(helpers.htmlEntitiesDecode(value))).trim();
    }, 
    sanitizeTextArea(value){
        return helpers.stripExcessWhitespaceTextArea(helpers.stripTags(helpers.htmlEntitiesDecode(value))).trim();
    },
    signToken(userId, isVerified, accountType){

        return jtw.sign({
            userId, 
            isVerified, 
            accountType
        }, config.jwt_secret, {
            expiresIn : '1 hour'
        });
    }, 
    sanitizeForumPost(content){

        return sanitizer(content, {
            allowedTags : ['p','br','img','b','strong','i','em','u'], 
            allowedAttributes : ['src']
        });

    }
}

module.exports = helpers;