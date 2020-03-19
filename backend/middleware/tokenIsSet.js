const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    const bearerToken = req.headers['authorization'];

    if(!bearerToken)
        res.status(403).json({
            status : 'error', 
            data : {
                msg : 'No token provided.'
            }
        });

    const tokenArr = bearerToken.split(' ');
    const token = tokenArr[1];

    if(!token)
        res.status(403).json({
            status : 'error', 
            data : {
                msg : 'There was an issue processing the token.'
            }
        });

    try{

        const result = jwt.verify(token, config.jwt_secret);

        req.userId = result.userId;
        req.isVerified = result.isVerified;
        req.accountType = result.accountType;

        next();
        
    }catch(e){
        res.status(403).json({
            status : 'error', 
            data : {
                msg : 'There was an issue processing the token.'
            }
        });
    }


}