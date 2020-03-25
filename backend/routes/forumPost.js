const tokenIsSet = require('../middleware/tokenIsSet');
const generalAccountTypeOnly = require('../middleware/generalAccountTypeOnly');
const obtainAccountStatus = require('../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../middleware/checkIfUserFrozen');
const accountIsVerified = require('../middleware/accountVerified');
const validateNewForumPost = require('../middleware/validation/validateNewForumPost');
const forumPostController = require('../controllers/forumPostController');


const router = require('express').Router();

//Create new forum post route
router.post(
    '/',
    tokenIsSet, 
    generalAccountTypeOnly, 
    obtainAccountStatus, 
    checkIfUserRemoved, 
    checkIfUserFrozen, 
    accountIsVerified, 
    validateNewForumPost, 
    forumPostController.createNewForumPost
    );

router.post(
    '/likes',
    tokenIsSet, 
    generalAccountTypeOnly, 
    obtainAccountStatus,
    checkIfUserRemoved,
    checkIfUserFrozen, 
    accountIsVerified, 
    forumPostController.submitPostLike
);


module.exports = router;