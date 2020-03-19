const router = require('express').Router();
const tokenIsSet = require('../../middleware/tokenIsSet');

router.post('/announcements', tokenIsSet);


module.exports = router;