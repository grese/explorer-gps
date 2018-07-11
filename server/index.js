
const PORT = 8888;
const bodyParser = require('body-parser');
const {logger, expressLogger} = require('./logger');
const {gpsApi, socketServer} = require('./gps-api');

gpsApi.use(bodyParser.json());
gpsApi.use(expressLogger);
socketServer.listen(PORT, () => {
  logger.info(`ExplorerGPS is listening on port ${PORT}`);
});
