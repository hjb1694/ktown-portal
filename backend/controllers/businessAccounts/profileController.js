const {validationResult} = require('express-validator');

exports.insertAnnouncement = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    res.send('insert announcement controller');


}