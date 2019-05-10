"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const session = require('express-session');
const hbs = require('handlebars'); //View engine middleware
const xhbs = require('express-handlebars') //Udvidelse til handlebars
const expressValidator = require('express-validator'); //Input validering af req.body
const cookeParser = require('cookie-parser');
const bodyParser = require('body-parser'); //Middleware til at parse req.body
const handlebarsIntl = require('handlebars-intl'); //Middleware til hbs data formatering
const MongoStore = require('connect-mongo')(session); //Gemme session i mongodb i stedet for sysMem

// ROUTES FOR THE SERVER
const index = require('./routes/public/index');
const login = require('./routes/public/login');
const user = require('./routes/public/user');
const adminIndex = require('./routes/admin/index');
const adminLogin = require('./routes/admin/login');
const adminUsers = require('./routes/admin/users');
const adminSubscriptions = require('./routes/admin/subscriptions');
const adminShop = require('./routes/admin/shop');
const shopIndex = require('./routes/shop/index');

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

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
app.use(session({
  secret: 'hemmelig',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 120 * 60 * 1000 } //60 min
}));
app.use(expressValidator());

// VISIBLE IN ALL VIEWS:
app.use(function (req, res, next) {
  res.locals.session = req.session;
  res.locals.metaTags = {
    title: 'Title',
    description: 'Description',
    keywords: 'Keywords'
  };
  next();
});

// PUBLIC
app.use('/', index);
app.use('/login', login);
app.use('/user', user);

const events = require('./routes/public/events');
app.use('/events', events);

// ADMIN
app.use('/admin', adminIndex);
app.use('/admin/login', adminLogin);
app.use('/admin/users', adminUsers);
app.use('/admin/subscriptions', adminSubscriptions);

const adminNews = require('./routes/admin/news');
app.use('/admin/news', adminNews);
// SHOP
app.use('/admin/shop', adminShop);
app.use('/shop', shopIndex);

// Render error view, when URL is not found in routes !!NEEDS TO BE DEFINED AFTER ROUTES!!
app.use(function (req, res, next) {
  res.locals.metaTags = {
    title: '404 - not found',
    description: 'Here goes the description',
    keywords: 'Here goes keywords'
  };
  res.status(404).render('error');
});

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

// START THE SERVER
const port = process.env.PORT || config.localPort;
app.listen(port);
console.log('Listening on port ' + port + ' ...');

module.exports = app;