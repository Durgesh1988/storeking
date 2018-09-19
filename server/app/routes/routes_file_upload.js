
const fileUpload = require('../model/file-upload');
const apiUtil = require('../utils/apiUtil');
const uuid = require('node-uuid');

module.exports.setRoutes = function(app) {

    app.post('/file-upload', function(req, res) {
        if(req.files && req.files.file) {
            let fileId = req.query.fileId;
            if(fileId === '' || fileId === null){
                fileId = uuid.v4();
            }else{
                fileId = req.query.fileId;
            }
            fileUpload.uploadFile(req.files.file.originalFilename,req.files.file.path,fileId,function(err,fileData){
                if(err){
                    res.send({message: "Unable to upload file"});
                }
                apiUtil.removeFile(req.files.file.path);
                res.send({fileId:fileData});
            })
        } else if(req.query.fileId !== '' && req.query.fileId !== null) {
            apiUtil.removeFile(req.files.file.path);
            res.send({fileId:req.query.fileId});
        } else{
            apiUtil.removeFile(req.files.file.path);
            res.send({message: "Bad Request"});
        }
    });

    app.delete('/fileUpload', function(req, res) {
        fileUpload.removeFileByFileId(req.query.fileId,function(err,fileData){
            if(err){
                res.send({message: "Unable to delete file"});
            }
            res.send(fileData);
        })
    });

    app.get('/fileUpload', function(req, res) {
        fileUpload.getReadStreamFileByFileId(req.query.fileId,function(err,file){
            if(err){
                res.send({message: "Unable to delete file"});
            }
            res.send(file);
        })
    });
};


