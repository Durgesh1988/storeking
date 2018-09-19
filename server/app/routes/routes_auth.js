
const authService = require('../service/authService');
const authValidator = require('../validator/authValidator');
const validate = require('express-validation');
const jwt = require('jsonwebtoken');
const config = require('../config/store-king-settings');
const { secret } = config.jwt;

module.exports.setRoutes = function(app) {
    /**
     *
     * @api {post} /auth/login Login
     * @apiName Login
     * @apiDescription Login
     * @apiGroup Auth
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email_id Username
     * @apiParam {String} password Password
     *
     * @apiSuccess (200) {String} message description
     *
     */
    app.post('/auth/login',validate(authValidator.login), (req, res, next)=> {
        authService.login(req.body,(err,login) => {
            if(err){
                return res.status(500).send(err);
            }else{
                return res.status(200).send(login);
            }
        })
    });
    /**
     *
     * @api {post} /auth/sign-up Sign-Up
     * @apiName Sign-Up
     * @apiDescription Register into application
     * @apiGroup Auth
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
    app.post('/auth/sign-up',validate(authValidator.signUp), (req, res, next) => {
        authService.signUp(req.body,(err,login) => {
            if(err){
                return res.status(500).send(err);
            }else{
                return res.status(200).send(login);
            }
        })
    });

    /**
     *
     * @api {patch} /auth/logout Logout
     * @apiName Logout
     * @apiDescription Logout from application
     * @apiGroup Auth
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email_id Username
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.patch('/auth/logout',validate(authValidator.logout), (req, res, next) => {
        req.logout();
        req.session.destroy();
        authService.logout(req.body,(err,logout) => {
            if(err){
                return res.status(500).send(err);
            }else{
                return res.status(200).send(logout);
            }
        })
    });

    /**
     *
     * @api {patch} /auth/reset-password Reset Password
     * @apiName Password Reset
     * @apiDescription Reset Password for a Specific User
     * @apiGroup Auth
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email_id Username
     * @apiParam {String} password Password
     * @apiParam {String} confirm_password Confirm Password
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.patch('/auth/reset-password',validate(authValidator.resetPassword),(req, res, next) =>  {
        const token = req.headers['token'];
        if (!token)
            return callback({error_code:401,auth: false, message: 'No token provided.' },null);
        jwt.verify(token, secret, (err, decoded) => {
            if (err)
                return callback({error_code: 500, auth: false, message: 'Failed to authenticate token.'}, null);
            else {
                authService.resetPassword(req.body, (err, resetPassword) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        return res.status(200).send(resetPassword);
                    }
                })
            }
        });
    });

    /**
     *
     * @api {patch} /auth/forget-password Forget Password
     * @apiName Forget Password
     * @apiDescription Forget Password for a Specific User
     * @apiGroup Auth
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email_id Email
     *
     * @apiSuccess (200) {String} message description
     *
     */

    app.patch('/auth/forget-password',validate(authValidator.forgetPassword),(req, res, next) => {
        authService.forgetPassword(req.body,(err,resetPassword) => {
            if(err){
                return res.status(500).send(err);
            }else{
                return res.status(200).send(resetPassword);
            }
        })
    });
};
