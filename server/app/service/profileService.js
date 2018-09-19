
const logger = require('../logger/logger')(module);
const profiles = require('../model/profiles');
const comments = require('../model/comments');
const apiUtil = require('../utils/apiUtil.js');
const config = require('../config/store-king-settings');
const cryptography = require('../utils/cryptography');
const async = require("async");
const profileService = module.exports = {};

profileService.createNewProfile = function createNewProfile(reqBody,callback) {
    if(reqBody.password !== reqBody.confirm_password){
        return callback({message:'Confirm Password is not same as password.'}, null);
    }
    delete reqBody.confirm_password;
    const cryptConfig = config.cryptSetting;
    const cryptography_obj = new cryptography(cryptConfig.algorithm, cryptConfig.password);
    reqBody['created_on'] = new Date().getTime();
    reqBody['modified_on'] = new Date().getTime();
    reqBody['password'] = cryptography_obj.encryptText(reqBody['password'],cryptConfig.encryptionEncoding,cryptConfig.decryptionEncoding);
    checkProfileDuplicate(reqBody,function(err,result){
        if(err)
            return callback(err,null);
        else {
            profiles.createNewProfile(reqBody, function (err, profile) {
                if (err)
                    return callback(err, null);
                return callback(null, profile);
            })
        }
    })
}

profileService.updateProfileById = function updateProfileById(profileId,reqBody,callback){
    if(reqBody.password !== reqBody.confirm_password){
        return callback({message:'Confirm Password is not same as password.'}, null);
    }
    delete reqBody.confirm_password;
    const cryptConfig = config.cryptSetting;
    const cryptography_obj = new cryptography(cryptConfig.algorithm, cryptConfig.password);
    reqBody['modified_on'] = new Date().getTime();
    reqBody['password'] = cryptography_obj.encryptText(reqBody['password'],cryptConfig.encryptionEncoding,cryptConfig.decryptionEncoding);
    profiles.getProfileById(profileId,(err,profile) => {
        if(err)
            return callback(err,null);
        else if(profile === null)
            return callback({message:"Profile is not available in DB."},null);
        else {
            profiles.updateProfileById(profileId,reqBody,(err,profile) => {
                if(err)
                    return callback(err,null);
                else
                    return callback(null,profile);
            });
        }
    })
};


profileService.getProfileById = function getProfileById(profileId,callback){
    profiles.getProfileById(profileId,(err,profile) => {
        if(err)
            return callback(err,null);
        else if(profile === null)
            return callback({message:"Profile is not available in DB."},null);
        else
            return callback(null,profile);
    })
};

profileService.getProfiles = function getProfiles(filterObj,callback) {
    let reqData = {};
    async.waterfall([
        (next) => {
            apiUtil.paginationRequest(filterObj, 'profiles', next);
        },
        (paginationReq, next) => {
            paginationReq['searchColumns'] = ['first_name', 'last_name', 'email_id', 'mobile_number'];
            reqData = paginationReq;
            apiUtil.databaseUtil(paginationReq, next);
        },
        (queryObj, next) => {
            profiles.getProfileWithPagination(queryObj, next);

        },
        (filterProfileList, next) => {
            apiUtil.paginationResponse(filterProfileList, reqData, next);
        }
    ], (err, results) => {
        if (err) {
            logger.error(err);
            return callback(err, null);
        } else {
            return callback(null, results);
        }
    });
}

profileService.getPostComments = function getPostComments(email_id,callback){
    comments.getComments({email_id:email_id},(err,comment_list) => {
        if(err)
            return callback(err,null);
        return callback(null,comment_list);
    })
};

profileService.getPostCommentDashboard = function getPostCommentDashboard(email_id,callback){
    let comment_dashboard = {
        total_post:0,
        total_like:0,
        total_comment:0
    }
    profiles.getPostCommentDashboard(email_id,(err,postProfileComments) => {
        if(err)
            return callback(err,null);
        else if(postProfileComments.comments.length > 0){
            comment_dashboard.total_post  =  postProfileComments.comments.length;
            postProfileComments.comments.forEach((comment)=>{
                comment_dashboard.total_like = comment_dashboard.total_like + comment.likes.length;
                comment_dashboard.total_comment = comment_dashboard.total_comment + comment.comments.length;
            });
            return (null,comment_dashboard);
        }else
            return (null,comment_dashboard);
    })
};

profileService.deleteProfileById = function deleteProfileById(profileId,callback){
    profiles.deleteProfileById(profileId,(err,profile) => {
        if(err)
            return callback(err,null);
        else
            return callback(null,profile);
    })
};

function checkProfileDuplicate(userData,callback){
    async.parallel({
        email_id : (callback) => {
            profiles.getProfiles({email_id:userData.email_id},(err,data)=>{
                if(err)
                    callback(err,null);
                else if(data.length > 0)
                    callback({message:"Username is already available in DB. Please entered different username."},null);
                else
                    callback(null,data);
            });
        },
        email_id : (callback) => {
            profiles.getProfiles({email_id:userData.email_id},(err,data) =>{
                if(err)
                    callback(err,null);
                else if(data.length > 0)
                    callback({message:"Email ID is already available in DB. Please entered different email."},null);
                else
                    callback(null,data);
            });
        }
    },(err,result)=>{
        if(err)
            callback(err,null);
        callback(null,result);
    })
}