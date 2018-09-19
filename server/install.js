
var spawn = require('child_process').spawn;
var currentDirectory = __dirname;
function getDefaultsConfig() {
    var config = {
        express: {
            port: 3002,
            express_sid_key: 'express.sid',
            sessionSecret: 'sessionSecret'
        },
        jwt: {
            secret: "jwtSecr3t",
            expiresInSec: 604800
        },
        app_run_port: 3002,
        default_time_zone: 'IST',
        storeKingDataDir: currentDirectory + '/store-king',
        configDirName: 'config',
        tempDirName: 'temp',
        storeKingAuthHeaderName:'x-store-king-auth',
        app_run_secure_port: 443,
        cryptSetting: {
            algorithm: "aes192",
            password: "pass@!@#",
            encryptionEncoding: "ascii",
            decryptionEncoding: "base64",
        },
        constantData: {
            sort_order : "desc",
            sort_reference_data : {
                "comments":"created_on",
                "profiles":"created_on"
            },
            skip_Records : 1,
            max_record_limit : 200,
            record_limit : 10,
            expire_period : 30
        },
        db: {
            dbName: 'store-king',
            host: 'localhost',
            port: '27017'
        },
        authStrategy: {
            local: true,
            externals: false
        },
        get tempStoreKing() {
            return this.storeKingDataDir + '/' + this.tempDirName + '/';
        },
        get storeKing() {
            return this.storeKingDataDir + '/' + this.configDirName + '/';
        }
    };
    return config;
}

function parseArguments() {
    var cliArgs = require("command-line-args");
    var cli = cliArgs([{
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Help"
    }, {
        name: "db-host",
        type: String,
        description: "DB Host"
    }, {
        name: "db-port",
        type: String,
        description: "DB Port"
    }, {
        name: "db-name",
        type: String,
        description: "DB Port"
    }]);

    var options = cli.parse();

    var usage = cli.getUsage({
        header: "Store-King-Assessment App help",
        footer: "For more information, visit http://storeking.in/"
    });

    if (options.help) {
        console.log(usage);
        process.exit(0);
    }
    return options;
}

function getConfig(config, options) {
    config.db.host = options['db-host'] ? options['db-host'] : config.db.host;
    config.db.port = options['db-port'] ? options['db-port'] : config.db.port;
    config.db.dbName = options['db-name'] ? options['db-name'] : config.db.dbName;
    return config;
}

function installPackageJson() {
    console.log("Installing node packages from package.json");
    var procInstall = spawn('npm', ['install', '--unsafe-perm']);
    procInstall.stdout.on('data', function(data) {
        console.log("" + data);
    });
    procInstall.stderr.on('data', function(data) {
        console.error("" + data);
    });
    procInstall.on('close', function(packageInstallRetCode) {
        if (packageInstallRetCode === 0) {
            console.log("Installation Successful.");
            process.exit(0);
        } else {
            console.log("Error occurred while installing packages from apidoc.json");
            process.exit(1);
        }
    });
}

function createConfigFile(config) {
    console.log('creating configuration json file');
    var configJson = JSON.stringify(config);
    var fs = require('fs');
    fs.writeFileSync('app/config/store-king-settings.json', configJson);
}
console.log('Installing node packages required for installation');
proc = spawn('npm', ['install',"heml", "command-line-args@0.5.3", 'mkdirp@0.5.0', 'fs-extra@0.18.0', 'ldapjs@0.7.1', 'mongodb@2.2.29']);
proc.on('close', function(code) {
    if (code !== 0) {
        throw "Unable to install packages"
    } else {
        const options = parseArguments();
        const defaultConfig = getDefaultsConfig();
        const config = getConfig(defaultConfig, options);
        console.log('creating store king home directory');
        const mkdirp = require('mkdirp');
        mkdirp.sync(config.storeKing);
        mkdirp.sync(config.tempStoreKing);
        createConfigFile(config);
        installPackageJson();

    }
});
proc.stdout.on('data', function(data) {
    console.log("" + data);
});

proc.stderr.on('data', function(data) {
    console.error("" + data);
});
