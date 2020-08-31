var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var admin = require('./routes/admin');
var jwt = require('jsonwebtoken');
var keyConfig = require('./config');

var app = express();

app.jwt = jwt;
app.jwtSecret = 'votechain';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require(__dirname + '/middleware.js').makeAuthHappen().unless({
  path: ['/404']
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);

// catch 404
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function (err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  
  res.status(err.status || 500);
  res.render('error', {
		JWTData: req.JWTData
	});
});




var mongoURI = keyConfig.mongoURI;

app.db = mongoose.createConnection(mongoURI,{useNewUrlParser: true,useUnifiedTopology: true});

app.db.on('error', console.error.bind(console, 'mongoose connection error: '));

app.db.once('open', function () {
  console.log("Connected to ", mongoURI);
});

import { models } from './model';
models(app, mongoose);





var debug = require('debug')('votechain-node:server');
var http = require('http');




var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);



var server = http.createServer(app);



server.listen(port);
server.on('error', onError);
server.on('listening', onListening);




function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    
    return val;
  }

  if (port >= 0) {
  
    return port;
  }

  return false;
}



function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}

module.exports = server;