const router = require('express').Router();
const accountController = require('../../controllers/generalAccounts/accountController');
const tokenIsSet = require('../../middleware/tokenIsSet');
const newPasswordValidation = require('../../middleware/validation/newPasswordValidation');
const obtainAccountStatus = require('../../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../../middleware/checkIfUserFrozen');
const validateBlockUnblockUser = require('../../middleware/validation/validateBlockUnblockUser');
const accountIsVerified = require('../../middleware/accountVerified');
const validateFollowToggle = require('../../middleware/validation/validateFollowToggle');
const generalAccountTypeOnly = require('../../middleware/generalAccountTypeOnly');

router.post(
    '/changePassword', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved, 
    newPasswordValidation, 
    accountController.changePassword);

router.post(
    '/blockUser', 
    (req,res,next) => {req.action = 'block'; next();},
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved,
    accountIsVerified,
    validateBlockUnblockUser,
    accountController.blockUser);

router.post(
    '/unblockUser', 
    (req,res,next) => {req.action = 'unblock'; next();},
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved,
    accountIsVerified,
    validateBlockUnblockUser,
    accountController.unblockUser);

router.post(
    '/followUser', 
    tokenIsSet, 
    generalAccountTypeOnly,
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen, 
    accountIsVerified,
    validateFollowToggle,
    accountController.followUser);


module.exports = router;