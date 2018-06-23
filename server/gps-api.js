const express = require('express');
const gpsApi = express();

// Just a dummy route.  This can be removed once we start adding real routes.
gpsApi.get('/', (req, res) => {
  res.status(200).send('ExplorerGPS is running');
});

module.exports = gpsApi;
