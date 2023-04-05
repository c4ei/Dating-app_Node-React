var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3003',
    'http://localhost:3004',
    'http://date.c4ei.net',
    'http://dapi.c4ei.net'
  ];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, GET, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Credentials');
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token, Authorization',
  );
  next();
});

app.use('/users', require('./server/rest/components(C-M-R)/user/routes'));
app.use('/genders', require('./server/rest/components(C-M-R)/gender/routes'));
app.use('/interests', require('./server/rest/components(C-M-R)/interests/routes'));
app.use('/auth', require('./server/rest/components(C-M-R)/auth/routes'));
app.use('/visits', require('./server/rest/components(C-M-R)/visit/routes'));
app.use('/matchs', require('./server/rest/components(C-M-R)/match/routes'));
app.use('/likes', require('./server/rest/components(C-M-R)/like/routes'));
app.use('/block', require('./server/rest/components(C-M-R)/block/routes'));
app.use('/report', require('./server/rest/components(C-M-R)/report/routes'));
app.use('/chat', require('./server/rest/components(C-M-R)/chatroom/routes'));
app.use('/notification', require('./server/rest/components(C-M-R)/notification/routes'), );
app.use('/validation', require('./server/rest/components(C-M-R)/userValidation/routes'), );
app.use('/images', require('./server/rest/components(C-M-R)/images/routes'));

const server = require('http').Server(app);
global.io = require('socket.io')(server);
require('./server/socket/socket')();

module.exports = app;
