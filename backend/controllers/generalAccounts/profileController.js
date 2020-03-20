const {
    getUserProfileByUsername
} = require('../../database/queries/userProfile');
const moment = require('moment');

exports.getProfile = async (req,res) => {

    const {username} = req.params;

    try{

        const result = await getUserProfileByUsername(username);

        if(!result.length){
            return res.status(404).json({
                status : 'error', 
                data : {
                    msg : 'User not found'
                }
            });
        }

        const {dateOfBirth, accountPrivate} = result[0];
        const age = moment().diff(moment(dateOfBirth), 'years');

        if(accountPrivate){

            let ageRange;
            switch(age){


                
            }


        }else{




        }


        res.send('found');




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