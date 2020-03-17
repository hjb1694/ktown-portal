const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;
const {
    insertNewUser, 
    getLoginCredentials
} = require('../database/queries/user');
const {
    sanitizeTextField, 
    signToken
} = require('../utils/helpers');
const sendEmail = require('../utils/sendEmail');


/*
REGISTER CONTROLLER
POST /api/v1/auth/register
--Public--
*/

exports.register = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({errors : errors.array()});

    try{

        const vericode = uuid();

        const {
            username, 
            email, 
            password, 
            dob
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 8);

        const result = await insertNewUser({
            username : sanitizeTextField(username), 
            email : sanitizeTextField(email), 
            password : hashedPassword, 
            dob, 
            vericode
        });

        const userId = result[0];

        const token = signToken(userId, false);

        await sendEmail({
            from : '"NO_REPLY" <no-reply@ktown-portal.com>',
            recipientEmail : 'hbradfield20@gmail.com', //Modify Later
            subject : 'Please verify your account', 
            msg : `
            <p><strong>Please use the verification code below</strong></p>
            <p>${vericode}</p>
            ` //Modify Later
        });

        res.status(201).json({
            status : 'created',
            data : {
                token
            }
        });


    }catch(e){
        console.log(e);

        res.status(500).json({
            errors : [
                {msg : 'A server error has occurred.'}
            ]
        });
    }
} 


/*
LOGIN CONTROLLER 
POST /api/v1/auth/login
--Public--
*/

exports.login = async (req,res) => {

    const {email, password} = req.body;

    try{

        const result = await getLoginCredentials(email);

        if(!result.length)
            return res.status(403).json({
                status : 'error', 
                data : {
                    msg : 'The credentials you entered are invalid or this account does not exist.'
                }
            });

        const {hashedPassword, isVerified} = result[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if(!match)
            return res.status(403).json({
                status : 'error',
                data : {
                    msg : 'The credentials you entered are invalid or this account does not exist.'
                }
            });



    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'A server error has occurred.'
            }
        });

    }



}