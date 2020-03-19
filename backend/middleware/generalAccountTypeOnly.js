module.exports = (req,res,next) => {

    if(req.accountType && req.accountType === 'general'){
        next();
    }else{

        return res.status(403).json({
            status : 'error', 
            data : {
                msg : 'General accounts can only perform this action.'
            }
        });

    }


}