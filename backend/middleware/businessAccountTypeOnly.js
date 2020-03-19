module.exports = (req,res,next) => {

    if(req.accountType && req.accountType === 'business'){
        next();
    }else{

        return res.status(403).json({
            status : 'error', 
            data : {
                msg : 'Business accounts can only perform this action.'
            }
        });

    }


}