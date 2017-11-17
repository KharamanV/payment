const config = require('config');
const mongoose = require('mongoose');
const connectionConfig = { useMongoClient: true };

mongoose.Promise = Promise;

// Register models
require('../models');

// Connect to MongoDB
mongoose.connection
  .on('error', err => console.error('[MongoDB] connection error:', err) || process.exit(-1))
  .on('open', () => console.info('[MongoDB] connected'));

if (process.env.NODE_ENV === 'production') {
  connectionConfig.config = Object.assign({}, { autoIndex: false });
}

mongoose.connect(config.mongo, connectionConfig);

module.exports = mongoose;
