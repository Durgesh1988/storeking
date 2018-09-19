
const logger = require('../logger/logger')(module);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

const profileSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email_id:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image_id:{
        type:String,
        required:true
    },
    created_on:{
        type:Number,
        required:false
    },
    modified_on:{
        type:Number,
        required:false
    }
});
profileSchema.plugin(mongoosePaginate);

profileSchema.statics.createNewProfile = function createNewProfile(profileData,callback){
    const profile = new profiles(profileData);
    profile.save(function(err, data) {
        if (err) {
            logger.error("createNew Failed", err, data);
            return callback(err,null);
        }
        return callback(null,data);
    });
};

profileSchema.statics.getProfileWithPagination = function getProfileWithPagination(query, callback) {
    this.paginate(query.queryObj, query.options,
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.getProfiles = function getProfiles(query, callback) {
    this.find(query,
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.updateProfileById = function updateProfileById(profileId,fields, callback) {
    this.update({_id:new ObjectId(profileId)}, {$set:fields},
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.getProfileById = function getProfileById(profileId,callback) {
    this.findById(profileId,
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.removeProfiles = function removeProfiles(filters, callback) {
    this.remove(filters,
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.removeProfileById = function removeProfileById(profileId, callback) {
    this.remove({_id:new ObjectId(profileId)},
        function (err, profiles) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, profiles);
            }
        }
    );
};

profileSchema.statics.getPostCommentDashboard = function getPostCommentDashboard(email_id, callback) {
    this.aggregate([{
        $match: {
            email_id: email_id
        }
    }, {
        $lookup: {
            from: "comments",
            localField: "email_id",
            foreignField: "email_id",
            as: "comments"
        }
    }], (err, postComments) => {
        if (err) {
            return callback(err, null);
        }else{
            return callback(null,postComments[0])
        }
    })
};

const profiles = mongoose.model('profile', profileSchema);
module.exports = profiles;
