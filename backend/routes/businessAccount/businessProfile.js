const router = require('express').Router();
const profileController = require('../../controllers/businessAccounts/profileController');
const tokenIsSet = require('../../middleware/tokenIsSet');
const businessAccountTypeOnly = require('../../middleware/businessAccountTypeOnly');
const obtainAccountStatus = require('../../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../../middleware/checkIfUserFrozen');
const businessAnnouncentValidation = require('../../middleware/validation/businessAnnouncementValidation');

router.post(
    '/announcements',
    tokenIsSet, 
    businessAccountTypeOnly, 
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen, 
    businessAnnouncentValidation,
    profileController.insertAnnouncement
    );


module.exports = router;