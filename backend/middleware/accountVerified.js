module.exports = (req,res,next) => {

    if(!req.isVerified)
        return res.status(403).json({
            status : 'error', 
            data : {
                msg : 'Please verify your account.'
            }
        });

    next();

}