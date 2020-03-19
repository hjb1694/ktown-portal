const {checkAccountStatus : checkAccountStatusGeneralUser} = require('../database/queries/user');
const {checkAccountStatus : checkAccountStatusBusinessUser} = require('../database/queries/businessUser');

module.exports = async (req,res,next) => {

    const userId = req.userId;
    const accountType = req.accountType;

    let result;

    if(userId && accountType === 'general'){

        result = await checkAccountStatusGeneralUser(userId);

        const {accountStatus, username : accountName} = result[0];

    }else if(userId && accountType === 'business'){

        result = await checkAccountStatusBusinessUser(userId);

        const {accountStatus, name : accountName} = result[0];

    }else{

        return res.status(422).json({
            status : 'error', 
            data : {
                msg : 'User ID and/or accountType not provided in request.'
            }
        });

    }


    req.accountStatus = accountStatus;
    req.username = accountName;

    next();

}