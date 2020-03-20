const router = require('express').Router();
const tokenIsSet = require('../../middleware/tokenIsSet');
const accountController = require('../../controllers/generalAccounts/accountController');
const newPasswordValidation = require('../../middleware/validation/newPasswordValidation');
const obtainAccountStatus = require('../../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../../middleware/checkIfUserFrozen');
const validateBlockUnblockUser = require('../../middleware/validation/validateBlockUnblockUser');
const accountIsVerified = require('../../middleware/accountVerified');
const validateFollowToggle = require('../../middleware/validation/validateFollowToggle');
const generalAccountTypeOnly = require('../../middleware/generalAccountTypeOnly');
const followToggleCheckedIfBlocked = require('../../middleware/followToggleCheckIfBlocked');
const {checkIfBlocked} = require('../../database/queries/user');
const {validationResult} = require('express-validator');

router.post(
    '/changePassword', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved, 
    newPasswordValidation, 
    accountController.changePassword);

router.post(
    '/blockUnblockUser', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved,
    accountIsVerified,
    validateBlockUnblockUser,
    accountController.blockUnblockUser);

router.post(
    '/followUnfollowUser', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen, 
    accountIsVerified,
    validateFollowToggle,
    async (req,res,next) => {

        const errors = validationResult(req);
    
        if(!errors.isEmpty())
            return res.status(422).json({
                status : 'error', 
                data : {
                    errors : errors.array()
                 }
             });
    
        const {userToFollowUnfollow, action} = req.body;
    
        const result = await checkIfBlocked(req.userId, userToFollowUnfollow);
    
        const count = +result[0].count;
    
        if(count){
            if(action === 'unfollow'){
    
                return res.status(200).json({
                    status : 'ok', 
                    data : {
                        msg : 'You are not following this user.'
                    }
                });
    
            }else{
                return res.status(403).json({
                    status : 'error', 
                    data : {
                        msg : 'You are blocked by this user.'
                    }
                });
            }
        }
    
        next();
    },
    accountController.followUnfollowUser);

router.post(
    '/approveFollowRequest', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus,
    checkIfUserRemoved,
    checkIfUserFrozen, 
    accountIsVerified
);


module.exports = router;