const {checkAccountStatus : checkAccountStatusGeneralUser} = require('../database/queries/user');
const {checkAccountStatus : checkAccountStatusBusinessUser} = require('../database/queries/businessUser');

module.exports = async (req,res,next) => {

    const userId = req.userId;
    const accountType = req.accountType;

    let result;
    let accountStatus;
    let accountName;

    if(userId && accountType === 'general'){

        result = await checkAccountStatusGeneralUser(userId);

        accountStatus = result[0].accountStatus;
        accountName = result[0].username;


    }else if(userId && accountType === 'business'){

        result = await checkAccountStatusBusinessUser(userId);

        accountStatus = result[0].accountStatus;
        accountName = result[0].name;

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