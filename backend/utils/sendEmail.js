const config = require('../config');
const mailer = require('nodemailer');

const main = async ({from, recipientEmail, subject, msg}) => {

    try{


        const transporter = mailer.createTransport({
            host : config.nodemailer.host,
            port : config.nodemailer.port, 
            secure : false, 
            auth : {
                user : config.nodemailer.user,
                pass : config.nodemailer.pass
            }
        });


        await transporter.sendMail({
            from, 
            to : recipientEmail, 
            subject, 
            html : msg
        });


    }catch(e){
        console.log(e);
        throw new Error('Email failed to send');
    }

}

module.exports = main;