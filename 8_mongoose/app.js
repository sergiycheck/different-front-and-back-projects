const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const api = require('./routes');

const app = express();
global.util = require('./config/util');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', api);
require('./config/error-handler')(app);

module.exports = app;
