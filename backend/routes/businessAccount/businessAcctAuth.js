const router = require('express').Router();
const authController = require('../../controllers/businessAccounts/authController');

router.post('/login', authController.login);

module.exports = router;