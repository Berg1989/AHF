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

// Select hbs-helper
hbs.registerHelper("select", function (value, options) {
  return options.fn(this)
      .split('\n')
      .map(function (v) {
          var t = 'value="' + value + '"'
          return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
      })
      .join('\n')
});

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);


// ROUTES FOR THE APP
// PUBLIC
const index = require('./routes/public/index');
app.use('/', index);

const login = require('./routes/public/login');
app.use('/login', login);

const user = require('./routes/public/user');
app.use('/user', user);

const events = require('./routes/public/events');
app.use('/events', events);

// ADMIN
const adminIndex = require('./routes/admin/index');
app.use('/admin', adminIndex);

const adminLogin = require('./routes/admin/login');
app.use('/admin/login', adminLogin);

const adminUsers = require('./routes/admin/users');
app.use('/admin/users', adminUsers);

const adminSubscriptions = require('./routes/admin/subscriptions');
app.use('/admin/subscriptions', adminSubscriptions);

const adminNews = require('./routes/admin/news');
app.use('/admin/news', adminNews);

// Render error view, when URL is not found in routes !!NEEDS TO BE DEFINED AFTER ROUTES!!
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