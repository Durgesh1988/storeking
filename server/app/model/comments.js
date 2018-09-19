
const logger = require('../logger/logger')(module);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = new Schema({
    email_id:{
        type:String,
        required:true
    },
    image_id:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    likes:[
        {
            email_id: {
                type: String,
                required: true
            }
        }
     ],
    comments:[
        {
            email_id: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]
});
commentSchema.plugin(mongoosePaginate);

commentSchema.statics.createNewComment = function createNewComment(commentData,callback){
    const comment = new comments(commentData);
    comment.save(function(err, data) {
        if (err) {
            logger.error("createNew Failed", err, data);
            return callback(err,null);
        }
        return callback(null,data);
    });
};

commentSchema.statics.getCommentWithPagination = function getCommentWithPagination(query, callback) {
    this.paginate(query.queryObj, query.options,
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

commentSchema.statics.getComments = function getComments(query, callback) {
    this.find(query,
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

commentSchema.statics.updateCommentById = function updateCommentById(commentId,fields, callback) {
    this.update({_id:new ObjectId(commentId)}, {$set:fields},
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

commentSchema.statics.getCommentById = function getCommentById(commentId,callback) {
    this.findById(commentId,
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

commentSchema.statics.removeComments = function removeComments(filters, callback) {
    this.remove(filters,
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

commentSchema.statics.removeCommentById = function removeCommentById(commentId, callback) {
    this.remove({_id:new ObjectId(commentId)},
        function (err, comments) {
            if (err) {
                return callback(err);
            } else {
                return callback(null, comments);
            }
        }
    );
};

const comments = mongoose.model('comment', commentSchema);
module.exports = comments;
