const bcrypt = require('bcryptjs');
const {
    getLoginCredentials
} = require('../../database/queries/businessUser');
const {signToken} = require('../../utils/helpers');

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