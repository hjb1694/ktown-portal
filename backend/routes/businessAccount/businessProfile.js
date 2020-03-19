const router = require('express').Router();
const tokenIsSet = require('../../middleware/tokenIsSet');
const businessAccountTypeOnly = require('../../middleware/businessAccountTypeOnly');
const obtainAccountStatus = require('../../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../../middleware/checkIfUserFrozen');

router.post(
    '/announcements',
    tokenIsSet, 
    businessAccountTypeOnly, 
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen
    );


module.exports = router;