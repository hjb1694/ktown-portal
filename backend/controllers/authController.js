const {validationResult} = require('express-validator');

exports.register = (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({errors : errors.array()});

    res.status(201).send('All is good!');
} 