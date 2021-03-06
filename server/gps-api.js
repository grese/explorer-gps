const express = require('express');
const path = require('path');
const gpsApi = express();
const bodyParser = require('body-parser');
const http = require('http').Server(gpsApi);
const io = require('socket.io')(http);
const {logger, expressLogger} = require('./logger');

const messageTypes = {
  USER_LOCATION: 'USER_LOCATION',
  USER_CONNECTED: 'USER_CONNECTED',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  USER_JOINED_MAP: 'USER_JOINED_MAP'
};

var rootChannel = 'lobby';
var channels = {};
var users = {};
var participants = {};

gpsApi.use(bodyParser.json());
gpsApi.use(bodyParser.urlencoded({ extended: true }));   // to support URL-encoded bodies
gpsApi.use(express.static(path.join(__dirname, 'public')));

gpsApi.use(expressLogger);

gpsApi.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// socket.io connections
io.on('connection', function(socket){
  
  socket.join(rootChannel);
  users[socket.id] = '';
  channels[socket.id] = rootChannel;
  addParticipantToChannel(socket, rootChannel);

  var timestamp = new Date() ;
  logger.info('[' + timestamp + '] system-message: ' + socket.id + ' connected');
  io.emit('system-message', {type: messageTypes.USER_CONNECTED, for: 'everyone', user: socket.id, message: socket.id + ' connected', timestamp: timestamp });

  // handle disconnection
  socket.on('disconnect', function(){
    timestamp = new Date();
    logger.info('[' + new Date() + '] system-message: ' + socket.id + ' disconnected');
    io.emit('system-message', {type: messageTypes.USER_DISCONNECTED, for: 'everyone', user: socket.id, message: socket.id + ' disconnected', timestamp: timestamp});
  });

  socket.on('system-gps', function(data){
    timestamp = new Date();
    if(data.mapsToBroadcast != null && data.coordinates != null && data.userid != null){
      logger.info('[' + timestamp.toUTCString() + '] system-gps: [' + data.coordinates.latitude + ' ' + data.coordinates.longitude + '] @ below channels');
      for(var i = 0; i < data.mapsToBroadcast.length; i++){
        logger.info('Forwarding GPS data to map: ' + data.mapsToBroadcast[i].mapID);
        io.to(data.mapsToBroadcast[i].mapID).emit('system-message', {type: messageTypes.USER_LOCATION, for: 'everyone', userid: data.userid, message: data.coordinates, timestamp: timestamp});  
      }
    } else {
      logger.info('necessary payload fields are missing');
    }
    
  });

  // handle channel change 
  socket.on('channel-join', function(data){
    timestamp = new Date();
    removeParticipantFromChannel(socket);
    logger.info('[' + timestamp.toUTCString() + '] channel-join: ' + data);
    io.emit('system-message', {type: messageTypes.USER_JOINED_CHANNEL, for: 'everyone', userid: getUserInfo(socket.id), message: 'user joined channel ' + String(data), timestamp: timestamp.toUTCString() });
    addParticipantToChannel(socket, String(data));
    listParticipants(String(data));
    socket.emit('channel-participants', participants[String(data)]);
  });

  // handle alias change 
  socket.on('alias-change', function(data){
    timestamp = new Date();
    io.emit('system-message', { for: 'everyone', userid: getUserInfo(socket.id), message: 'user changed alias to ' + data, timestamp: timestamp.toUTCString() });
    users[socket.id] = data;
  });
  

});

// get current alias by socked ID
function getUserInfo(socketID){
  if(users[socketID] == ''){
    return 'anonymous user';
  } else {
    return users[socketID];
  }
}

function addParticipantToChannel(socket, channelString){
  if(participants[channelString] == null){
    participants[channelString] = {};
  } 
  participants[channelString][socket.id] = true;
  channels[socket.id] = channelString;
  socket.join(channelString);
  logger.info('adding participant to channel: ' + channelString);
}

function removeParticipantFromChannel(socket){
  logger.info('removing participant from channel: ' + channels[socket.id]);
  delete participants[channels[socket.id]][socket.id];
  socket.leave(channels[socket.id]);
}

function listParticipants(channelString){
  logger.info('');
  logger.info('--- list of participants @ ' + channelString);
  logger.info(participants[channelString]);
  
}

module.exports = http;

