module.exports = (req,res,next) => {

    if(req.accountStatus == 2)
        return res.status(403).json({
            status : 'error', 
            data : {
                msg : 'Your account is frozen and under review.'
            }
        });


    next();

}