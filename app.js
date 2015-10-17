var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');

var routes = require('./routes/index');


var app = express();

// var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//
//
server.listen(3000);

//cookie-session
app.use(cookieSession({
  name: 'session',
  keys: ['SESSION_KEY1', 'SESSION_KEY2', 'SESSION_KEY3']
}));

app.use(function (req, res, next) {
  io.on('connection', function (socket) {
    req.session.clientID = socket.id;
  });

  next();
});




// app.get('/', function(req, res, next) {
//   res.sendFile(path.resolve(__dirname +'/public/test-index.html'));
// });

//socket.io client connections/disconnects
var clients = [];

io.on('connection', function (socket) {
  clients.push(socket.id);
  // socket.broadcast.emit('clients', clients);
  io.emit('clients', clients);

  socket.on('testing', function (data) {
    console.log(data.user + ' logged from server');
    socket.emit('test', clients + ' sent from server to be logged by client');
    socket.emit('test', 'you are: ' + socket.id);
  });

  socket.on('disconnect', function (data) {
    console.log(data.id);
    clients.splice(clients.indexOf(data.id), 1);
    // socket.broadcast.emit('clients', clients);
    io.emit('clients', clients);

  });
});


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname +'/js'));
app.use('/assets', express.static(__dirname +'/assets'));
app.use('/css', express.static(__dirname +'/css'));
app.use('/images', express.static(__dirname+'/images'));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
