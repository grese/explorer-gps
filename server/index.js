
const {parsed: config = {}} = require('dotenv').config();
const PORT = config.NODE_ENV === 'production' ? 8888 : 8888;
const gpsApi = require('./gps-api').gpsApi;
const http = require('./gps-api').http;
const {logger, expressLogger} = require('./logger');

gpsApi.use(expressLogger);

gpsApi.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

http.listen(PORT, () => {
  logger.info(`ExplorerGPS is listening on port ${PORT}`);
});

