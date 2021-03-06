const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;
const {
    insertNewUser, 
    getLoginCredentials, 
    resetPassword, 
    insertAccountSettings, 
    insertProfileInfo
} = require('../../database/queries/user');
const {
    sanitizeTextField, 
    signToken
} = require('../../utils/helpers');
const sendEmail = require('../../utils/sendEmail');


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

        await insertAccountSettings(userId);
        await insertProfileInfo(userId);

        const token = signToken(userId, false, 'general');

        await sendEmail({
            from : '"NO_REPLY" <no-reply@ktown-portal.com>',
            recipientEmail : email,
            subject : 'Please verify your account', 
            msg : `
            <p><strong>Please use the verification code below</strong></p>
            <p>${vericode}</p>
            ` //Modify Later
        });

        res.status(201).json({
            status : 'created',
            data : {
                token, 
                accountType : 'general'
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

        const {
            id : userId, 
            password : hashedPassword, 
            isVerified, 
            account_status : accountStatus, 
            username
        } = result[0];

        const match = await bcrypt.compare(password, hashedPassword);

        if(!match)
            return res.status(403).json({
                status : 'error',
                data : {
                    msg : 'The credentials you entered are invalid or this account does not exist.'
                }
            });

        if(accountStatus > 2)
            return res.status(403).json({
                status : 'error', 
                data : {
                    msg : `${username} is no longer a registered user.`
                }
            });

        const token = await signToken(userId, isVerified, 'general');

        res.status(200).json({
            status : 'success', 
            data : {
                token, 
                accountType : 'general'
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

/*
RESET PASSWORD CONTROLLER
POST /api/v1/auth/resetPassword
--public--
*/

exports.resetPassword = async (req,res) => {

    const {email} = req.body;

    try{

        const result = await getLoginCredentials(email);

        if(result.length){

            const {id : userId, account_status : accountStatus} = result[0];

            if(accountStatus < 3){

                const newPass = uuid().substring(0,8);

                const newPassHashed = await bcrypt.hash(newPass, 8);

                await changePassword(userId, newPassHashed);

                await sendEmail({
                    from : '"NO_REPLY" <no-reply@ktown-portal.com>',
                    recipientEmail : email,
                    subject : 'Your new password with instructions', 
                    msg : `
                    <p><strong>Please use the verification code below</strong></p>
                    <p>${newPass}</p>
                    ` //Modify Later
                });

            }

        }

        res.status(200).json({
            status : 'ok', 
            data : {
                msg : 'If your email address exists in our records, a new password has been created and sent to your email.'
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