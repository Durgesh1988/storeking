
const logger = require('../logger/logger')(module);
const profiles = require('../model/profiles');
const loginModel = require('../model/login');
const jwt = require('jsonwebtoken');
const cryptography = require('../utils/cryptography');
const config = require('../config/store-king-settings');
const { secret, expiresInSec } = config.jwt;
const profileService = require('../service/profileService');
const authService = module.exports = {};

authService.login = function login(reqBody,callback) {
    console.log(reqBody);
    profiles.getProfiles({email_id:reqBody.email_id},(err,profile) =>{
        if(err)
            return callback(err,null);
        else if(profile.length === 0){
            return callback({error:true,message:"You have entered an invalid username or password"},null);
        }else{
            const cryptConfig = config.cryptSetting;
            const cryptography_obj = new cryptography(cryptConfig.algorithm, cryptConfig.password);
            const decryptPassword =cryptography_obj.decryptText(profile[0].password,cryptConfig.decryptionEncoding,cryptConfig.e);
            if(reqBody.password !== decryptPassword){
                return callback({error:true,message:"You have entered wrong password."},null);
            }else{
                const userObject = {
                    name:profile[0].name,
                    email_id:profile[0].email_id
                };
                const token = jwt.sign(userObject, secret, {
                    expiresIn: expiresInSec
                });
                const loginObj = {
                    email_id:reqBody.email_id,
                    login_on: new Date().getTime()
                }
                userObject['token'] = token;
                loginModel.login(loginObj,(err,data) =>{
                    if(err)
                        return callback(err,null);
                    return callback(null,{error:false,message:'Login Successful',user_data:userObject})
                })
            }
        }
    });
}

authService.logout = function logout(reqBody,callback){
    loginModel.logout(reqBody.email_id,{logout:new Date().getTime()},(err,data) => {
        if(err)
            return callback(err,null);
        return callback(null,data);
    });
};

authService.resetPassword = function resetPassword(login_id,reqBody,callback){
    if(reqBody.password !== reqBody.confirm_password){
        return callback({error:true,message:'Confirm Password is not same as password.'}, null);
    }
    delete reqBody.confirm_password;
    const cryptConfig = config.cryptSetting;
    const cryptography_obj = new cryptography(cryptConfig.algorithm, cryptConfig.password);
    reqBody['modified_on'] = new Date().getTime();
    reqBody['password'] = cryptography_obj.encryptText(reqBody['password'],cryptConfig.encryptionEncoding,cryptConfig.decryptionEncoding);
    profiles.getProfileById(login_id,(err,profile) => {
        if(err)
            return callback(err,null);
        else if(profile === null)
            return callback({message:"Profile is not available in DB."},null);
        else {
            profiles.updateProfileById(login_id,reqBody,(err,profile) => {
                if(err)
                    return callback(err,null);
                else
                    return callback(null,{error:false,message:'Password is reset successfully.'});
            });
        }
    })
};

authService.forgetPassword = function forgetPassword(reqBody,callback){
    profiles.getProfiles({email_id:reqBody.email_id},(err,profile) =>{
        if(err)
            return callback(err,null);
        else if(profile.length === 0){
            return callback({error:true,message:"You have entered an invalid email"},null);
        }else{
            const cryptConfig = config.cryptSetting;
            const cryptography_obj = new cryptography(cryptConfig.algorithm, cryptConfig.password);
            const decryptPassword =cryptography_obj.decryptText(profile[0].password,cryptConfig.decryptionEncoding,cryptConfig.e);
            return callback(null,{error:false,message:'Get Password Successful',user_data:{email_id:profile[0].email_id,password:decryptPassword}})
        }
    });
};

authService.signUp =  function(reqBody,callback){
    profileService.createNewProfile(reqBody,(err,result)=>{
        if(err)
            return callback(err,null);
        return callback(null,result);
    });
}
