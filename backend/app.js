const config = require('./config');
const express = require('express');
const fileupload = require('express-fileupload');
const app = express();

app.use(express.json());
app.use(fileupload());

//Routes
app.use('/api/v1/auth', require('./routes/generalAccount/generalAcctAuth'));
app.use('/api/v1/account', require('./routes/generalAccount/generalAccount'));


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

module.exports = app;