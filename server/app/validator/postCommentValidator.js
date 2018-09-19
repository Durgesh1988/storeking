const Joi = require('joi');

const postCommentValidator = module.exports = {};

postCommentValidator.getComments = {
    query: {
        page: Joi.string().min(1).max(2).required(),
        pageSize: Joi.string().min(1).max(3).required()
    }
};


postCommentValidator.postComment = {
    body: {
        email_id: Joi.string().min(5).max(50).required(),
        image_id: Joi.string().min(1).max(50).required(),
        desc: Joi.string().min(1).max(250).required()
    }
};

postCommentValidator.updateComment = {
    params: {
        comment_id: Joi.string().min(1).max(40).required()
    },
    body: {
        image_id: Joi.string().min(1).max(50).required(),
        desc: Joi.string().min(1).max(250).required()
    }
};

postCommentValidator.likeComment = {
    params: {
        comment_id: Joi.string().min(1).max(40).required()
    },
    body: {
        email_id: Joi.string().min(5).max(50).required()
    }
};

postCommentValidator.commentOnPostComment = {
    params: {
        comment_id: Joi.string().min(1).max(40).required()
    },
    body: {
        email_id: Joi.string().min(5).max(20).required(),
        comment: Joi.string().min(1).max(250).required()
    }
};

postCommentValidator.deleteComment = {
    params: {
        comment_id: Joi.string().min(1).max(40).required()
    }
};