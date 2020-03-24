const {validationResult} = require('express-validator');
const isBase64 = require('is-base64');
const {
    sanitizeForumPost
} = require('../utils/helpers');
const JSDOM = require('jsdom').JSDOM;

exports.createNewForumPost = async (req,res) => {

    let errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const {
        headline, 
        content, 
        category
    } = req.body;

    errors = [];

    const sanitizedContent = sanitizeForumPost(content);

    const {document} = (new JSDOM(sanitizedContent)).window;

    const imgElems = document.getElementsByTagName('img');


    if(imgElems.length > 3)
        errors.push({msg : 'Only up to 3 images are allowed.'});

    if(imgElems.length){

        const srcs = [];

        for(let i = 0; i < imgElems.length; i++){

            srcs.push(imgElems[i].getAttribute('src'));

        }

        if(srcs.length){
            const allIsBase64 = srcs.every(item => isBase64(item, {mimeRequired : true}));

            if(!allIsBase64)
                errors.push({msg : 'Images must be base64 format.'});
                    
        }
    }

    if(errors.length)
        return res.status(422).json({
            status : 'error', 
            data : {
                errors
            }
        });


    res.send('Create new forum post controller');


}