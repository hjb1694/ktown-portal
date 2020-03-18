module.exports = (req,res,next) => {

    if(req.accountStatus > 2)
        return res.status(403).json({
            status : 'error', 
            data : {
                msg : `${req.username} is no longer a registered user.`
            }
        });

    next();

}