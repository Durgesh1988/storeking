const crypto = require('crypto');
const fs = require('fs');
const logger = require('../logger/logger')(module);

function Cryptography(algorithm, password) {
    const encrypt = function(text, encryptionEncoding, decryptionEncoding) {
        let encryptedText;
        let cipher = crypto.createCipher(algorithm, password);
        encryptedText = cipher.update(text, encryptionEncoding, decryptionEncoding);
        encryptedText += cipher.final(decryptionEncoding);
        return encryptedText;
    }

    const decrypt = function(text, decryptionEncoding, encryptionEncoding) {
        let decryptedText;
        let decipher = crypto.createDecipher(algorithm, password);
        decryptedText = decipher.update(text, decryptionEncoding, encryptionEncoding);
        decryptedText += decipher.final(encryptionEncoding);
        return decryptedText;
    }

    this.encryptText = function(text, encryptionEncoding, decryptionEncoding) {
        return encrypt(text, encryptionEncoding, decryptionEncoding);
    }


    this.encryptFile = function(inputFilePath, encryptionEncoding, outputFilePath, decryptionEncoding, callback) {
        fs.readFile(inputFilePath, {
            encoding: 'ascii'
        }, function(err, fileData) {
            if (err) {
                logger.debug(err);
                callback(err);
                return;
            }
            const encryptedData = encrypt(fileData, encryptionEncoding, decryptionEncoding);
            fs.writeFile(outputFilePath, encryptedData, {
            }, function(err) {
                if (err) {
                    logger.debug(err);
                    callback(err, null);
                    return;
                }
                callback(null);
            });
        });

    };

    this.decryptText = function(text, decryptionEncoding, encryptionEncoding) {
        return decrypt(text, decryptionEncoding, encryptionEncoding);
    };

    this.decryptFile = function(inputFilePath, decryptionEncoding, outputFilePath, encryptionEncoding, callback) {
        fs.readFile(inputFilePath, {
            encoding: 'ascii'
        }, function(err, fileData) {
            if (err) {
                logger.debug(err);
                callback(err);
                return;
            }
            const decryptData = decrypt(fileData, decryptionEncoding, encryptionEncoding);
            fs.writeFile(outputFilePath, decryptData, {
            }, function(err) {
                if (err) {
                    logger.debug(err);
                    callback(err, null);
                    return;
                }
                fs.chmodSync(outputFilePath,'400');
                logger.debug('Set file ' + outputFilePath + ' permission to 400');
                callback(null);
            });
        });
    };

}


module.exports = Cryptography;