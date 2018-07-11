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
  console.log(socket.id);
  socket.on('receive-gps', function (data) {

    rclient.hmset( socket.id, 'latitude',data.lat,'longitude',data.lon, function(err) {
      if(err)
        console.log('error');
      else
        console.log(data);
    });

  });
  

});

module.exports = gpsApi;
