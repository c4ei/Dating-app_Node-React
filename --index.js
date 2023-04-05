const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.API_PORT || 3004;
const app = express();

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

server.listen(port, () => {
  console.log(`Matcha is listening on port ${port}!`);
});
