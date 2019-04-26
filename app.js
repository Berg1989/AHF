"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const session = require('express-session');
const hbs = require('express-hbs');
const expressValidator =  require('express-validator');
const cookeParser =  require('cookie-parser');
const bodyParser =  require('body-parser');

const app = express();
app.engine('hbs', hbs.express4({
    partialsDir: 'views/partials'
  }));
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookeParser());
app.use(session({secret: 'hemmelig', saveUninitialized: true, resave: true}));
app.use(expressValidator());

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, {useNewUrlParser: true});

// ROUTES FOR THE APP
const registrationRouter = require('./routes/registration');
app.use('/registration', registrationRouter);
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);
const userProfiles = require('./routes/userprofiles');
app.use('/userprofiles', userProfiles);

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;