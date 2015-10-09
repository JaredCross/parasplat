var express = require('express');
var router = express.Router();

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(8080);


router.get('/', function(req, res,next) {
    res.sendFile('index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });

});

module.exports = router;
