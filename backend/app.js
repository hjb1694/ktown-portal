const config = require('./config');
const express = require('express');
const fileupload = require('express-fileupload');
const app = express();

app.use(express.json());
app.use(fileupload());

//=======Routes===========
//General Account
app.use('/api/v1/auth', require('./routes/generalAccount/generalAcctAuth'));
app.use('/api/v1/account', require('./routes/generalAccount/generalAccount'));
//Business Account
app.use('/api/v1/business/auth', require('./routes/businessAccount/businessAcctAuth'));
//Shared


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

module.exports = app;