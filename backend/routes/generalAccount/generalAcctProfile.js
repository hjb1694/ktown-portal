const router = require('express').Router();
const profileController = require('../../controllers/generalAccounts/profileController');

router.get('/:username', profileController.getProfile);


module.exports = router;