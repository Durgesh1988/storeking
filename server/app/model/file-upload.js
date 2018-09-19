
const fs = require('fs');
const Grid = require('gridfs-stream');
const appConfig = require('../config/store-king-settings');
const logger = require('../logger/logger')(module);
let gfs = null;
const mongoDbClient = require('mongodb');
const uuid = require('node-uuid');
mongoDbClient.connect('mongodb://' + appConfig.db.host + ':' + appConfig.db.port + '/' + appConfig.db.dbName, function (err, db) {
    if (err) {
        throw "unable to connect to mongodb"
        return;
    }
    gfs = Grid(db, mongoDbClient);
});

const fileUpload = module.exports = {};

fileUpload.uploadFile = function uploadFile(filename, filePath, fileId, callback) {
    if(fileId === null){
        fileId = uuid.v4();
    }
    const writeStream = gfs.createWriteStream({
        _id: fileId,
        filename: filename,
        mode: 'w',
        content_type: 'image/png'
    });
    fs.createReadStream(filePath).pipe(writeStream).on('error', function (err) {
        logger.error(err);
        callback(err, null);
    }).on('finish', function () {
        callback(null, fileId)
    });
};

fileUpload.getFileByFileId = function getFileByFileId(fileId, callback) {
    gfs.findOne({
        _id: fileId
    }, function (err, file) {
        if (err) {
            callback(err, null);
        }
        callback(null, file);
    });
};

fileUpload.getReadStreamFileByFileId = function getReadStreamFileByFileId(fileId, callback) {
    let buffer = '';
    gfs.findOne({
        _id: fileId
    }, function (err, file) {
        if (err) {
            let err = new Error('Internal server error');
            err.status = 500;
            return callback(err);
        } else if (!file) {
            let err = new Error('File not found');
            err.status = 404;
            return callback(err);
        } else {
            let readStream = gfs.createReadStream({
                _id: file._id
            });
            readStream.on("data", function (chunk) {
                buffer += chunk;
            });
            readStream.on("end", function () {
                callback(null, {fileName: file.filename, fileData: buffer})
            });
            readStream.on("error", function (err) {
                callback(err, null)
            });
        }
    });
};

fileUpload.removeFileByFileId = function removeFileByFileId(fileId, callback) {
    gfs.files.remove({
        _id: fileId
    }, function (err, file) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, file);
        }
    });
};