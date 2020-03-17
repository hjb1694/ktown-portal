const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;
const {insertNewUser} = require('../database/queries/user');
const {
    sanitizeTextField, 
    signToken
} = require('../utils/helpers');

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