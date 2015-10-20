var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
require('dotenv').load();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var users = require('./db/database');

var routes = require('./routes/index');


var app = express();

// var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);



//passport and google-oauth
var passport = require('passport');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.PARASPLAT_SESSION_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PARASPLAT_SESSION_GOOGLE_CLIENT_SECRET,
    callbackURL: "https://parasplat.jaredcross.com/auth/google/callback",
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {

      return done(null, profile);

    // users.find({ googleId : profile.id}, function (err, data) {
    //   if (err) {
    //     users.insert({googleId : profile.id}, function (err, data) {
    //       return done(err, data);
    //     });
    //   } else {
    //     return done(err, data);
    //   }
    //   kjdsj = 9;
    // });

  }
));

//cookie-session
app.use(cookieSession({
  name: 'session',
  keys: [process.env.PARASPLAT_SESSION_KEY1,process.env.PARASPLAT_SESSION_KEY2, process.env.PARASPLAT_SESSION_KEY3]
}));

app.use( passport.initialize());
app.use( passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope:
    ['https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile']
  }));



  app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  app.post('/checkstatus', function (req, res) {
    users.insert({test:test});
    // if (req.user.data.email) {
    //   users.insert({
    //     displayName : req.user.data.displayName,
    //     email : req.user.data.email,
    //     gamesPlayed : 0,
    //     gamesWon: 0
    //   }, function (err, data) {
    //     res.send(data);
    //   });
    // } else {
    //   res.send('false');
    // }
    res.send(req.user);
  });



// app.use(function (req, res, next) {
//   io.on('connection', function (socket) {
//     req.session.clientID = socket.id;
//   });
//
//   next();
// });


//socket.io client connections/disconnects
var clients = [];
var gameNumber = 1;
var gameReadyTracker = {};

io.on('connection', function (socket) {
  clients.push(socket.id);
  io.emit('clients', clients);

  //move payer to game lobby
  socket.on('joinGameLobby', function (data) {
    socket.join('gameLobby');
  });

  //remove player form game lobby
  socket.on('leaveGameLobby', function (data) {
    socket.leave('gameLobby');
  });

  socket.on('disconnect', function (data) {
    clients.splice(clients.indexOf(data.id), 1);
    io.emit('clients', clients);
  });

  socket.on('lookingForGame', function (data) {
    var gameRooms = [];
    var allRooms = Object.keys(io.sockets.adapter.rooms);
    for (var i = 0; i < allRooms.length; i++) {
      if (allRooms[i].match('gameRoom')) {
        gameRooms.push(allRooms[i]);
      }
    }

    var allGamesFull = false;

    if (gameRooms.length === 0) {
      socket.join('gameRoom ' + socket.id);
      socket.leave('gameLobby');
      socket.emit('leaveLFG');
      io.to(socket.id).emit('player1');
    } else {
      for (var i = 0; i < gameRooms.length; i++) {
        if (Object.keys(io.sockets.adapter.rooms[gameRooms[i]]).length < 2) {
          socket.join(gameRooms[i]);
          socket.leave('gameLobby');
          socket.emit('leaveLFG');
          allGamesFull = false;
          io.to(socket.id).emit('player2');
          io.sockets.to(gameRooms[i]).emit('gameReady');
          break;
        } else {
          allGamesFull = true;
        }
      }
    }

    if (allGamesFull) {
      socket.join('gameRoom ' + socket.id);
      socket.leave('gameLobby');
      socket.emit('leaveLFG');
      io.to(socket.id).emit('player1');
    }
  });

  socket.on('p1Info', function (data) {
    io.sockets.to('gameRoom ' + socket.id).emit('p1InfoUpdate', data);
  });

  socket.on('p2Info', function (data) {
    if (socket.rooms[1]) {
      io.sockets.to('gameRoom ' + socket.rooms[1].substring(9)).emit('p2InfoUpdate', data);
    }
  });

  socket.on('pressedStart', function (data) {
    if (gameReadyTracker[socket.rooms[1].substring(9)]) {
        delete gameReadyTracker[socket.rooms[1].substring(9)];
        io.sockets.to('gameRoom ' + socket.rooms[1].substring(9)).emit('receivedReady');
    } else {
      gameReadyTracker[socket.rooms[1].substring(9)] = 1;
    }
  });

  socket.on('leaveGameRoom', function () {
    if (socket.rooms[1]) {
      socket.leave(socket.rooms[1].substring(9));
    }

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


module.exports = {
  app : app,
  server : server,
  io : io
};
