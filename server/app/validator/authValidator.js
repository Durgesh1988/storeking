const Joi = require('joi');

const authValidator = module.exports = {};

authValidator.signUp = {
    body: {
        name: Joi.string().min(1).max(50).required(),
        email_id: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(1).max(20).required(),
        confirm_password: Joi.string().min(1).max(20).required(),
        image_id: Joi.string().min(1).max(20).required()
    }
};

authValidator.login = {
    body: {
        email_id: Joi.string().min(1).max(40).required(),
        password: Joi.string().min(1).max(40).required()
    }
};

authValidator.logout = {
    body: {
        user_name: Joi.string().min(1).max(40).required()
    }
};


authValidator.resetPassword = {
    body: {
        email_id: Joi.string().min(1).max(40).required(),
        password: Joi.string().min(1).max(40).required(),
        confirm_password: Joi.string().min(1).max(40).required()
    }
};

authValidator.forgetPassword = {
    body: {
        email_id: Joi.string().min(1).max(40).required()
    }
};