
const postCommentService = require('../service/postCommentService');
const postCommentValidator = require('../validator/postCommentValidator');
const validate = require('express-validation');
const jwt = require('jsonwebtoken');
const config = require('../config/store-king-settings');
const { secret } = config.jwt;

module.exports.setRoutes = function(app) {
    app.post('/post-comment',validate(postCommentValidator.postComment), (req, res, next) =>{
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                postCommentService.postComment(req.body, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        });
    });

    app.patch('/post-comment/:comment_id',validate(postCommentValidator.updateComment),  (req, res ,next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                postCommentService.updatePostComment(req.params.comment_id, req.body, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        });
    });

    app.patch('/post-comment/:comment_id/like',validate(postCommentValidator.likeComment),(req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                postCommentService.likeComment(req.params.comment_id, req.body.user_name, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        });
    });

    app.delete('/post-comment/:comment_id',validate(postCommentValidator.deleteComment), (req, res, next) => {
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                postCommentService.deleteComment(req.params.comment_id, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        });
    });

    app.patch('/post-comment/:comment_id/comment',validate(postCommentValidator.commentOnPostComment), (req, res, next) =>{
        verifySession(req,(err,authenticated) => {
            if (err) {
                return res.send(err);
            } else {
                postCommentService.commentOnPostComment(req.params.comment_id, req.body, (err, comments) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(comments);
                    }
                })
            }
        });
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
