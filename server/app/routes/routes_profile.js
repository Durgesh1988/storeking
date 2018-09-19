
const profileService = require('../service/profileService');
const profileValidator = require('../validator/profileValidator');
const validate = require('express-validation');
const jwt = require('jsonwebtoken');
const config = require('../config/store-king-settings');
const { secret } = config.jwt;

module.exports.setRoutes = function(app) {
    /**
     *
     * @api {post} /profile
     * @apiName Create User Profile
     * @apiDescription Register User into application
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} name User Name
     * @apiParam {String} email_id User Email
     * @apiParam {String} password Password
     * @apiParam {String} confirm_password Confirm Password
     *
     * @apiSuccess (200) {String} message description
     *
     */
    app.post('/profile',validate(profileValidator.createNew), (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.createNewProfile(req.body, (err, profiles) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(profiles);
                    }
                })
            }
        });
    });

    /**
     *
     * @api {patch} /profile/:profile_id Update Profile
     * @apiName Update User Profile
     * @apiDescription Update User Info
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} name User Name
     * @apiParam {String} email_id User Email
     * @apiParam {String} password Password
     * @apiParam {String} confirm_password Confirm Password
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.patch('/profile/:profile_id',validate(profileValidator.updateProfile), (req, res, next) =>{
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.updateProfileById(req.params.profile_id,req.body,(err,profiles) => {
                    if(err){
                        return res.status(500).send(err);
                    }else{
                        return res.status(200).send(profiles);
                    }
                })
            }
        });
    });


    /**
     *
     * @api {get} /profile/:profile_id User Profile
     * @apiName Get User Profile
     * @apiDescription Get User Info based on Profile ID
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} profile_id User Profile ID
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.get('/profile/:profile_id',validate(profileValidator.get),(req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.getProfileById(req.params.profile_id, (err, profiles) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(profiles);
                    }
                })
            }
        });
    });

    /**
     *
     * @api {delete} /profile/:profile_id Delele User Profile
     * @apiName Delete a User Profile
     * @apiDescription Delete User Info based on Profile ID
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} profile_id User Profile ID
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.delete('/profile/:profile_id',validate(profileValidator.get), (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.deleteProfileById(req.params.profile_id, (err, profiles) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(profiles);
                    }
                })
            }
        });
    });

    /**
     *
     * @api {get} /profile User Profiles
     * @apiName Get all Users Profile with Pagination,Filter, Sort and Search
     * @apiDescription Get all Users Profile with Pagination,Filter, Sort and Search
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.get('/profile', (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.getProfiles(req.query, (err, profiles) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(profiles);
                    }
                })
            }
        })
    });

    /**
     *
     * @api {get} /profile/:user_name/comments User Comments
     * @apiName Get a User's Post Comment
     * @apiDescription Get a User's Post Comment
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} user_name User Email ID
     * @apiSuccess (200) {String} message description
     *
     */

    app.get('/profile/:user_name/comments',validate(profileValidator.getPostComments), (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.getPostComments(req.params.user_name, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        })
    });
    /**
     *
     * @api {get} /profile/:user_name/comments/dashboard User's Comment Performance
     * @apiName Get a User's Post Comment Performance
     * @apiDescription Get a User's Post Comment Performance
     * @apiGroup Profile
     * @apiVersion 1.0.0
     *
     * @apiParam {String} user_name User Email ID
     * @apiSuccess (200) {String} message description
     *
     */

    app.get('/profile/:user_name/comments/dashboard',validate(profileValidator.getPostComments), (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                profileService.getPostCommentDashboard(req.params.user_name, (err, dashboardData) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(dashboardData);
                    }
                })
            }
        })
    });
};

function verifySession(req,callback){
    const token = req.headers['token'];
    if (!token)
        return callback({error_code:401,auth: false, message: 'No token provided.' },null);
    jwt.verify(token, secret, (err, decoded) => {
        if (err)
            return callback({error_code:500,auth: false, message: 'Failed to authenticate token.'},null);
        else {
            return callback(null,{auth: true, message: 'Authenticated'});
        }
    });
}
