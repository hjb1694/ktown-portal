const {checkIfPostLimitReached} = require('../database/queries/forumPosts');

module.exports = (req,res,next) => {

    try{

        const limitReached = checkIfPostLimitReached(req.userId);

        if(limitReached)
            return res.status(403).json({
                status : 'error', 
                data : {
                    msg : 'You have reached your posting limit for today.'
                }
            });

        next();

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