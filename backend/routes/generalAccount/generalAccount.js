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