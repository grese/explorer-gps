
const {parsed: config = {}} = require('dotenv').config();
const PORT = config.NODE_ENV === 'production' ? 8888 : 8888;
const http = require('./gps-api');
const {logger} = require('./logger');

http.listen(PORT, () => {
  logger.info(`ExplorerGPS is listening on port ${PORT}`);
});

