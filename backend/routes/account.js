const router = require('express').Router();
const tokenIsSet = require('../middleware/tokenIsSet');
const accountController = require('../controllers/accountController');
const newPasswordValidation = require('../middleware/validation/newPasswordValidation');

router.post('/changePassword', tokenIsSet, newPasswordValidation, accountController.changePassword);


module.exports = router;