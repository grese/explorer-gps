
// const PORT = 8888;
const gpsApi = require('./gps-api');
const bodyParser = require('body-parser');
const {logger, expressLogger} = require('./logger');

gpsApi.use(bodyParser.json());
gpsApi.use(expressLogger);

// gpsApi.listen(PORT, () => {
//   logger.info(`ExplorerGPS is listening on port ${PORT}`);
// });
