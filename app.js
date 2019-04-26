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
//hbs.registerPartials('templates');
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