const auth = require('./routes_auth');
const profile = require('./routes_profile');
const comment = require('./routes_post_comments');
const fileUpload = require('./routes_file_upload');
const logger = require('../logger/logger')(module);

module.exports.setRoutes = function(app) {

    auth.setRoutes(app);
    profile.setRoutes(app);
    comment.setRoutes(app);
    fileUpload.setRoutes(app);
    app.use(errorHandler);

    function errorHandler(err, req, res, next) {
        if (err) {
            logger.error(err);
            var errorResponse = {
                'status': err.status,
                'message': err.message,
                'errors': []
            };
            if ('errors' in err) {
                for (var i = 0; i < err.errors.length; i++) {
                    if ('messages' in err.errors[i])
                        errorResponse.errors.push(err.errors[i].messages);
                }
            }
            return res.status(err.status).send(errorResponse);
        }
    }
}
