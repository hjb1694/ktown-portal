const config = require('./config');
const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileupload());

//=======Routes===========
//General Account
app.use('/api/v1/auth', require('./routes/generalAccount/generalAcctAuth'));
app.use('/api/v1/account', require('./routes/generalAccount/generalAccount'));
app.use('/api/v1/profile', require('./routes/generalAccount/generalAcctProfile'));
app.use('/api/v1/forum/post', require('./routes/forumPost'));
//Business Account
app.use('/api/v1/business/auth', require('./routes/businessAccount/businessAcctAuth'));
app.use('/api/v1/business/profile', require('./routes/businessAccount/businessProfile'));
//Shared
app.use('/api/v1/messages', require('./routes/messages'));


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));

module.exports = app;