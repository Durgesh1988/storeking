const Joi = require('joi');

const profileValidator = module.exports = {};


profileValidator.get = {
    params: {
        profile_id: Joi.string().min(1).max(40).required()
    }
};

profileValidator.getPostComments = {
    query: {
        email_id: Joi.string().min(1).max(40).required()
    }
};

profileValidator.createNew = {
    body: {
        name: Joi.string().min(1).max(50).required(),
        email_id: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(1).max(20).required(),
        confirm_password: Joi.string().min(1).max(20).required(),
        image_id: Joi.string().min(1).max(50).required()
    }
};

profileValidator.updateProfile = {
    params: {
        profile_id: Joi.string().min(10).max(40).required()
    },
    body: {
        name: Joi.string().min(1).max(50).required(),
        email_id: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(1).max(20).required(),
        confirm_password: Joi.string().min(1).max(20).required(),
        image_id: Joi.string().min(1).max(50).required()
    }
};