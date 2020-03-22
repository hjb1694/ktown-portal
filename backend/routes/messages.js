const router = require('express').Router();
const messageController = require('../controllers/messageController');
const tokenIsSet = require('../middleware/tokenIsSet');
const obtainAccountStatus = require('../middleware/obtainAccountStatus');
const checkIfUserRemoved = require('../middleware/checkIfUserRemoved');
const checkIfUserFrozen = require('../middleware/checkIfUserFrozen');
const accountIsVerified = require('../middleware/accountVerified');
const validateNewMessage = require('../middleware/validation/validateNewMessage');


app.post(
    '/',
    tokenIsSet, 
    obtainAccountStatus,
    checkIfUserRemoved, 
    checkIfUserFrozen, 
    // add account verfied middleware here...must make some undecided modifications 
    validateNewMessage,
    messageController.sendMessage
);

module.exports = router;
