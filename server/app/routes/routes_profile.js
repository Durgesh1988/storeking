
const profileService = require('../service/profileService');
const profileValidator = require('../validator/profileValidator');
const validate = require('express-validation');
const jwt = require('jsonwebtoken');
const config = require('../config/store-king-settings');
const { secret } = config.jwt;

module.exports.setRoutes = function(app) {
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
