const router = require('express').Router();
const registerValidation = require('../../middleware/validation/registerValidation');
const authController = require('../../controllers/generalAccounts/authController');

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;