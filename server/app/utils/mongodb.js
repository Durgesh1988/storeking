

const logger = require('../logger/logger')(module);
const mongoose = require('mongoose');
const extend = require('extend');
const defaults = {
    host: 'localhost',
    port: '27017',
    dbName: 'test'
};
module.exports = function(options, callback) {
    const def = extend({}, defaults);
    options = extend(def, options);
    logger.debug(options);
    logger.debug(defaults);
    let connectionString = 'mongodb://';
    connectionString += options.host;
    connectionString += ':' + options.port;
    connectionString += '/' + options.dbName;
    logger.debug(connectionString);
    const connectWithRetry = function() {
        return mongoose.connect(connectionString, function(err) {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                setTimeout(connectWithRetry, 5000);
            }
        });
    };
    connectWithRetry();
    mongoose.Promise = require('bluebird');
    mongoose.connection.on('connected', function() {
        callback(null);
    });
};
