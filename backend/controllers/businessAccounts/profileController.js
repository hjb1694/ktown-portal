const {validationResult} = require('express-validator');
const {
    insertAnnouncement
} = require('../../database/queries/businessProfile');

exports.insertAnnouncement = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(422).json({
            status : 'error', 
            data : {
                errors : errors.array()
            }
        });

    const {businessListingId, headline, details} = req.body;

    try{

        await insertAnnouncement({
            listingId : businessListingId, 
            headline, 
            details
        });

        res.status(201).json({
            status : 'success', 
            data : {
                msg  : 'Announcement Created!'
            }
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            status : 'error', 
            data : {
                msg : 'A server error has occurred.'
            }
        });
    }

}