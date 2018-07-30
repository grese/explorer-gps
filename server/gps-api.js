const express = require('express');
const gpsApi = express();
const server = require('http').Server(gpsApi);
const io = require('socket.io')(server);
//const redis = require('redis');
//const rclient = redis.createClient();
const {logger} = require('./logger');

// Just a dummy route.  This can be removed once we start adding real routes.
gpsApi.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/index.html');

});

// server.listen(8888);
io.on('connection', function (socket) {
  logger.info(socket.id);
  socket.on('receive-gps', function (/*data*/) {

    // rclient.hmset( socket.id, 'latitude',data.lat,'longitude',data.lon, function(err) {
    //   if(err)
    //     logger.info('redis client error', err);
    //   else
    //     logger.info(data);
    // });
  });
});

module.exports = {
  socketServer: server,
  gpsApi
};
