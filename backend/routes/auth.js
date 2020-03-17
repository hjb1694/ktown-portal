const router = require('express').Router();
const registerValidation = require('../middleware/validation/registerValidation');
const authController = require('../controllers/authController');

router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);



module.exports = router;