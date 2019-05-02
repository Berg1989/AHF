"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const session = require('express-session');
const hbs = require('handlebars');
const xhbs = require('express-handlebars')
const expressValidator = require('express-validator');
const cookeParser = require('cookie-parser');
const bodyParser = require('body-parser');
const handlebarsIntl = require('handlebars-intl');

const app = express();
app.engine('hbs', xhbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
handlebarsIntl.registerWith(hbs);
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookeParser());
app.use(session({ secret: 'hemmelig', saveUninitialized: true, resave: true }));
app.use(expressValidator());

hbs.registerHelper("select", function (value, options) {
  return options.fn(this)
      .split('\n')
      .map(function (v) {
          var t = 'value="' + value + '"'
          return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
      })
      .join('\n')
})

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, { useNewUrlParser: true });

// ROUTES FOR THE APP
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const subscriptionTypeRouter = require('./routes/subscriptionType');
app.use('/subscriptionType', subscriptionTypeRouter);

const userProfiles = require('./routes/userprofiles');
app.use('/userprofiles', userProfiles);

const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

// Render error view, when server responds with status 404
app.use(function(req, res, next){
  res.locals.metaTags = {
    title: '404 - not found',
    description: 'Here goes the description',
    keywords: 'Here goes keywords'
};
  res.status(404).render('error');
});

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;