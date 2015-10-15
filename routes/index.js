var express = require('express');
var router = express.Router();
var server = require('../bin/www');
var io = require('socket.io')(server);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname +'/public/index.html');
});


module.exports = router;
