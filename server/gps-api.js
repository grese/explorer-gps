const express = require('express');
const gpsApi = express();
var server = require('http').Server(gpsApi);
var io = require('socket.io')(server);
var redis = require('redis');
var rclient = redis.createClient();

// Just a dummy route.  This can be removed once we start adding real routes.
gpsApi.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');

});

server.listen(8888);
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
  	rclient.set("name1", data.my,redis.print);
// rclient.get("name1");
    console.log(data);
  });
});



module.exports = gpsApi;
