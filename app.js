"use strict";

// INITIALIZATION
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const session = require('express-session');
const hbs = require('handlebars'); //View engine middleware
const xhbs = require('express-handlebars') //Udvidelse til handlebars
const expressValidator = require('express-validator'); //Input validering af req.body
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); //Middleware til at parse req.body
const handlebarsIntl = require('handlebars-intl'); //Middleware til hbs data formatering
const MongoStore = require('connect-mongo')(session); //Gemme session i mongodb i stedet for sysMem
const passport = require('passport'); //User login and registration authentication handling
const flash = require('connect-flash'); //Session stored flash messages to render in views

// ROUTES FOR THE SERVER
const index = require('./routes/public/index');
const events = require('./routes/public/events');
const posts = require('./routes/public/posts');
const user = require('./routes/public/user');
const userLogin = require('./routes/public/login');
const userRegister = require('./routes/public/register');

const admin = require('./routes/admin/index');
const adminLogin = require('./routes/admin/login');
const adminUsers = require('./routes/admin/users');
const adminSubscriptions = require('./routes/admin/subscriptions');
const adminShop = require('./routes/admin/shop');
const adminNews = require('./routes/admin/news');

const shop = require('./routes/shop/shop');
const shopLogin = require('./routes/shop/login');
const shopOrders = require('./routes/admin/orders');

// MONGODB & MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(config.mongodb, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
require('./middleware/passport'); //Make passport reachable in other files

const app = express();
app.engine('hbs', xhbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
handlebarsIntl.registerWith(hbs);
app.use(express.static('public')); //Flags public folder as public
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'hemmelig',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 120 * 60 * 1000 } //60 min
}));
app.use(expressValidator());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// VISIBLE IN ALL VIEWS:
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.metaTags = {
    title: 'Title',
    description: 'Description',
    keywords: 'Keywords'
  };
  next();
});

// ADMIN
app.use('/admin/login', adminLogin);
app.use('/admin/users', adminUsers);
app.use('/admin/subscriptions', adminSubscriptions);
app.use('/admin/news', adminNews);
app.use('/admin/shop', adminShop);
app.use('/admin/shop/orders', shopOrders);
app.use('/admin', admin);

// SHOP
app.use('/shop', shop);
app.use('/shop/login', shopLogin);

// PUBLIC
app.use('/user/login', userLogin);
app.use('/user/register', userRegister);
app.use('/user', user);
app.use('/events', events);
app.use('/posts', posts)
app.use('/', index);

// Catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// Render error view, when URL is not found in routes !!NEEDS TO BE DEFINED AFTER defined ROUTES!!
app.use(function (req, res, next) {
  res.status(404).render('error', {
    metaTags: {
      title: 'AHF 404 - Not Found',
      description: 'Error page',
      keywords: 'Error and stuff'
    },
  });
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