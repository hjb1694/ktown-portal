const router = require('express').Router();

router.post('/register', (req,res) => {

    res.send('register route');

});



module.exports = router;