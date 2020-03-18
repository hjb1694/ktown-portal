const {checkAccountStatus} = require('../database/queries/user');

module.exports = async (req,res,next) => {

    const userId = req.userId;

    const result = await checkAccountStatus(userId);

    const {accountStatus : userAccountStatus, username} = result[0];

    req.accountStatus = userAccountStatus;
    req.username = username;

    next();

}