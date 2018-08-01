# explorer-gps [![CircleCI](https://circleci.com/gh/CMUCloudComputing/explorer-gps.svg?style=svg)](https://circleci.com/gh/CMUCloudComputing/explorer-gps)
NodeJS GPS service for explorer

## Development
### Pre-Requisites
- Install [NodeJS](https://nodejs.org/en/download/) *(version >= 8.x.x required)*

### Installation
- `cd explorer-gps`
- `npm install`

### Running the server
- `npm run start`

### Running Tests
- `npm run test`

### Linting
- `npm run lint`

## Usage Instructions

The below events should be emitted in the following format

### 'alias-change' 

  - Once socket connection is established set alias to Explorer user-id

  socket.emit("alias-change", userID );

  - Payload object should include the mapID 

  i.e. socket.emit("alias-change", 'f7152483-f147-451e-9af6-833eb8e121e7');


### 'channel-join' 

  - Once socket connection is established set channel to listen to updates on active map

  socket.emit("channel-join", mapID );
  
  - Payload object should include the mapID 

  i.e. socket.emit("channel-join", 'd935a328-dd9c-4818-b7c1-b6af26e204b8');


### 'system-gps'

  - To update GPS coordinates the client side socket emits an event named 'system-gps'

  socket.emit('system-gps', payload);

  - Payload object should include the following

  {
    userid: 'f7152483-f147-451e-9af6-833eb8e121e7',
    mapsToBroadcast: [
      { mapID: 'd935a328-dd9c-4818-b7c1-b6af26e204b8'},
      { mapID: 'fd950fed-6f53-4ea7-bd61-f387393b9290'} 
    ],
    coordinates: {
      latitude: 41.3888,
      longitude: 2.1590,
      heading: 0,
      speed: 0
    },
    timestamp: Date.now()
  }

