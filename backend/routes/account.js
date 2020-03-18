const router = require('express').Router();
const tokenIsSet = require('../middleware/tokenIsSet');
const accountController = require('../controllers/accountController');
const newPasswordValidation = require('../middleware/validation/newPasswordValidation');
const obtainAccountStatus = require('../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../middleware/checkIfUserFrozen');

router.post(
    '/changePassword', 
    tokenIsSet, 
    obtainAccountStatus, 
    checkIfUserRemoved, 
    newPasswordValidation, 
    accountController.changePassword);

router.post(
    '/blockUnblockUser', 
    tokenIsSet, 
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen,
    accountController.blockUnblockUser);


module.exports = router;