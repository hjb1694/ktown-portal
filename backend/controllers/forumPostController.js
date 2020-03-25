const {validationResult} = require('express-validator');
const isBase64 = require('is-base64');
const {promisify} = require('util');
const {
    sanitizeForumPost
} = require('../utils/helpers');
const {
    insertNewForumPost
} = require('../database/queries/forumPosts');
const JSDOM = require('jsdom').JSDOM;
const base64Img = require('base64-img');
const toImage = promisify(base64Img.img);
const uuid = require('uuid').v4;
const slash = require('slash');

/*
CREATE FORUM POST CONTROLLER
/api/v1/forum/post/
--private--
*/
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
        category, 
    } = req.body;

    try{  

        errors = [];
        const srcs = [];

        let sanitizedContent = sanitizeForumPost(content);

        const {document} = (new JSDOM(sanitizedContent)).window;

        const imgElems = document.getElementsByTagName('img');


        if(imgElems.length > 2)
            errors.push({msg : 'Only up to 2 images are allowed.'});

        if(imgElems.length && imgElems.length <= 2){

            for(let i = 0; i < imgElems.length; i++){

                srcs.push(imgElems[i].getAttribute('src'));

            }

            if(srcs.length){
                const allIsBase64 = srcs.every(item => isBase64(item, {mimeRequired : true}));

                if(!allIsBase64)
                    errors.push({msg : 'Images must be base64.'});

                const allIsRightSize= srcs.every(item => {

                    const splittedString = item.split('base64,');

                    const len = splittedString[1].length;

                    const approxSizeInBytes = len * (3/4);

                    return approxSizeInBytes < 1500000;


                });

                if(!allIsRightSize)
                    errors.push({msg : 'One of your images is too large.'});
                        
            }
        }

        if(errors.length)
            return res.status(422).json({
                status : 'error', 
                data : {
                    errors
                }
            });
 
        let imagePaths = {
            image1 : null, 
            image2 : null
        };

        if(srcs.length){

            let counter = 1;

            for(let value of srcs){

                let fileName = `${Date.now()}-${uuid()}`;

                fileName = await toImage(value, './public/uploads', fileName);

                fileName = slash(fileName);

                sanitizedContent = sanitizedContent.replace(value, `/${fileName}`);

                imagePaths[`image${counter}`] = `/${fileName}`;

                counter++;

            }

        }

        await insertNewForumPost({
            authorUserId : req.userId, 
            categoryId : category, 
            headline, 
            content : sanitizedContent, 
            mainImg : imagePaths.image1
        });

        res.status(201).json({
            status : 'success', 
            data : {
                msg : 'Forum post has been created'
            }
        });

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


/* 
SUBMIT POST LIKE CONTROLLER
/api/v1/forum/post/likes/
--private--
*/

exports.submitPostLike = async (req,res) => {




}