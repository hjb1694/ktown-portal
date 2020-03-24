const {validationResult} = require('express-validator');
const isBase64 = require('is-base64');
const {promisify} = require('util');
const {
    sanitizeForumPost
} = require('../utils/helpers');
const JSDOM = require('jsdom').JSDOM;
const base64Img = require('base64-img');
const toImage = promisify(base64Img.img);
const uuid = require('uuid').v4;

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
    const srcs = [];

    const sanitizedContent = sanitizeForumPost(content);

    const {document} = (new JSDOM(sanitizedContent)).window;

    const imgElems = document.getElementsByTagName('img');


    if(imgElems.length > 2)
        errors.push({msg : 'Only up to 2 images are allowed.'});

    if(imgElems.length){

        for(let i = 0; i < imgElems.length; i++){

            srcs.push(imgElems[i].getAttribute('src'));

        }

        if(srcs.length){
            const allIsBase64 = srcs.every(item => isBase64(item, {mimeRequired : true}));

            if(!allIsBase64)
                errors.push({msg : 'Images must be base64.'});
                    
        }
    }

    if(errors.length)
        return res.status(422).json({
            status : 'error', 
            data : {
                errors
            }
        });

    try{   
        let mainImagePath;

        if(srcs.length){

            mainImagePath = `${Date.now()}-${uuid()}`;

            await toImage(srcs[0], './public/uploads', mainImagePath);

        }

        res.send('Create new forum post controller');
    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'An server error has occurred.'
            }
        });
    }



}