
const logger = require('../logger/logger')(module);
const comments = require('../model/comments');
const postCommentService = module.exports = {};

postCommentService.postComment = function postComment(reqBody,callback) {
    comments.createNewComment(reqBody,(err,data) => {
        if(err){
            logger.error(err);
            return callback(err,null);
        } else{
            return callback(null,data);
        }
    });
}

postCommentService.updatePostComment = function updatePostComment(commentId,reqBody,callback) {
    comments.getCommentById(commentId, (err, data) => {
        if (err) {
            logger.error(err);
            return callback(err, null);
        } else if (data === null) {
            return callback({message: 'Post Comment is not available is DB.'}, null);
        } else {
            comments.updateCommentById(commentId, reqBody, (err, data) => {
                if (err) {
                    logger.error(err);
                    return callback(err, null);
                } else {
                    return callback(null, data);
                }
            });
        }
    })
}

postCommentService.deleteComment = function deleteComment(commentId,callback) {
    comments.getCommentById(commentId, (err, data) => {
        if (err) {
            logger.error(err);
            return callback(err, null);
        } else if (data === null) {
            return callback({message: 'Post Comment is not available is DB.'}, null);
        } else if ((data.likes && data.likes.length > 0) || (data.comments && data.comments.length > 0)) {
            return callback({message: 'Post Comment have some likes or comments. So system is not allowing to delete it.'}, null);
        } else {
            comments.removeCommentById(commentId, (err, result) => {
                if (err) {
                    logger.error(err);
                    return callback(err, null);
                } else {
                    return callback(null, result);
                }
            })
        }
    });
}

postCommentService.likeComment = function likeComment(commentId,user_name,callback){
    comments.getCommentById(commentId, (err, data) => {
        if (err) {
            logger.error(err);
            return callback(err, null);
        } else if (data !== null) {
            if (data.likes && data.likes > 0) {
                let duplicate_check = false;
                data.likes.forEach((like) => {
                    if (like.user_name === user_name) {
                        duplicate_check = true;
                    }
                });
                if (duplicate_check)
                    return callback({message: 'User is already like this comments.'}, null);
                else {
                    data.likes.push({user_name: user_name});
                }
            } else {
                data.likes.push({user_name: user_name});
            }
            comments.updateCommentById(commentId, {likes: data.likes}, (err, result) => {
                if (err)
                    return callback(err, null);
                return callback(null, result);
            })
        } else {
            return callback({message: 'Post Comment is not available in DB.'}, null);
        }
    });
};

postCommentService.commentOnPostComment = function commentOnPostComment(commentId,reqBody,callback){
    comments.getCommentById(commentId, (err, data) => {
        if (err) {
            logger.error(err);
            return callback(err, null);
        } else if (data !== null) {
            data.comments.push({
                user_name: reqBody.user_name,
                comment: reqBody.comment
            });
            comments.updateCommentById(commentId, {comments: data.comments}, (err, result) => {
                if (err)
                    return callback(err, null);
                return callback(null, result);
            })
        } else {
            return callback({message: 'Post Comment is not available in DB.'}, null);
        }
    });
};
