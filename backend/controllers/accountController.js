const {validationResult} = require('express-validator');
const {changePassword} = require('../database/queries/user');
const bcrypt = require('bcryptjs');

exports.changePassword = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error',
            data : {
                errors : errors.array()
            }
        });

    const {userId} = req;
    const {newPassword} = req.body;

    try{

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        await changePassword(userId, hashedPassword);

        res.status(200).json({
            status : 'success', 
            data : {
                msg : 'Password changed successfully.'
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

exports.blockUnblockUser = async (req,res) => {

    res.send('Block Unblock User Route');


}