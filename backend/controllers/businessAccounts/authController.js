const bcrypt = require('bcryptjs');
const {
    getLoginCredentials, 
    changePassword
} = require('../../database/queries/businessUser');
const {signToken} = require('../../utils/helpers');
const sendEmail = require('../../utils/sendEmail');

/*
LOGIN CONTROLLER 
POST /api/v1/business/auth/login
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
            account_status : accountStatus, 
            name
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
                    msg : `${name} is no longer a registered user.`
                }
            });

        const token = await signToken(userId, null, 'general');

        res.status(200).json({
            status : 'success', 
            data : {
                token, 
                accountType : 'business'
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
POST /api/v1/business/auth/resetPassword
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