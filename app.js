"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const session = require('express-session');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(session({secret: 'hemmelig', saveUninitialized: true, resave: true}));

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, {useNewUrlParser: true});

// ROUTES FOR THE APP
const router = require('./routes/routes');
app.use('/api', router);
const sessionRouter = require('./routes/session');
app.use('/session', sessionRouter);
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;