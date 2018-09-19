const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(expressSession);
const appConfig = require('./config/store-king-settings');
const logger = require('./logger/logger')(module);
const mongoDbConnect = require('./utils/mongodb');
const routes = require('./routes/routes');
const app = express();
const dbOptions = {
    host: process.env.DB_HOST || appConfig.db.host,
    port: appConfig.db.port,
    dbName: appConfig.db.dbName
};

mongoDbConnect(dbOptions, function (err) {
    if (err) {
        logger.error("Unable to connect to mongo db >>" + err);
        throw new Error(err);
    } else {
        logger.debug('connected to mongodb - host = %s, port = %s, database = %s', dbOptions.host, dbOptions.port, dbOptions.dbName);
    }
});
var mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection
}, function () {

});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

logger.debug("Initializing Session store in mongo");

const sessionMiddleware = expressSession({
    secret: 'sessionSecret',
    store: mongoStore,
    resave: false,
    saveUninitialized: true
});

app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join('../client', 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
    next();
});


logger.debug('Setting up application routes');
let routerV1 = express.Router();
routes.setRoutes(routerV1);
app.use(routerV1);
app.use('/api', routerV1);


app.use('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname,'../../client/otp-app/src', "index.html"));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err.message)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error');
});
module.exports = app;