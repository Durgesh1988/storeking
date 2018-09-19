
const logger = require('../logger/logger')(module);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const loginSchema = new Schema({
    email_id:{
        type:String,
        required:true
    },
    login_on:{
        type:Number,
        required:false
    },
    logout_on:{
        type:Number,
        required:false
    }
});
loginSchema.plugin(mongoosePaginate);

loginSchema.statics.login = function createNewComment(loginData,callback){
    const login_obj = new login(loginData);
    login_obj.save(function(err, data) {
        if (err) {
            logger.error("createNew Failed", err, data);
            return callback(err,null);
        }
        return callback(null,data);
    });
};


loginSchema.statics.logout = function logout(email_id,fields, callback) {
    this.update({email_id:email_id}, {$set:fields},
        function (err, logout) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, logout);
            }
        }
    );
};

const login = mongoose.model('login', loginSchema);
module.exports = login;
