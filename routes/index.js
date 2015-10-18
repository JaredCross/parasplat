var express = require('express');
var router = express.Router();
var server = require('../bin/www');
var io = require('socket.io')(server);
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.sendFile(path.resolve(__dirname +'/../public/test-index.html'));
  res.render('index');
});

router.get('/parasplat', function (req, res, next) {
  // res.sendFile(path.resolve(__dirname + '/../public/game.html'));
  res.render('game');
});


module.exports = router;
