const appConfig = require('../config/store-king-settings');
const commons=appConfig.constantData;
const fs = require('fs');
const logger = require('../logger/logger')(module);

const ApiUtil = function() {

    this.removeFile = function(filePath){
        fs.unlink(filePath, function(err) {
            if (err) {
                logger.error(err);
                return;
            } else{
                logger.debug("File is deleted successfully.")
                return;
            }
        });
    };

    this.paginationResponse = function(data,req,callback) {
        let response={};
        const sortField=req.mirrorSort;
        response[req.id]=data.docs;
        response['metaData']={
            totalRecords:data.total,
            pageSize:data.limit,
            page:data.page,
            totalPages:data.pages,
            sortBy:Object.keys(sortField)[0],
            sortOrder:req.mirrorSort ? (sortField[Object.keys(sortField)[0]]==1 ?'asc' :'desc') : '',
            filterBy:req.filterBy
        };
        return callback(null, response);
    };


    this.databaseUtil=function(jsonData,callback){
        let queryObj={};
        let queryArr=[];
        let objAnd = {}
        let objOr=[];
        let databaseCall={};
        let sortField=jsonData.mirrorSort;
        let key=Object.keys(sortField)[0];

        if(!jsonData.sortBy){
            let sortBy={};
            if(sortField[key] === -1){
                sortBy[commons.sort_reference_data[jsonData.id]] = 1;
            };
            if(sortField[key] === 1){
                sortBy[commons.sort_reference_data[jsonData.id]] = -1;
            }
            jsonData.sortBy=sortBy;
        }
        if(jsonData.search && jsonData.search.trim() !== '') {
            queryArr.push(objAnd);
            for(let i = 0; i < jsonData.searchColumns.length; i++){
                let searchParam={};
                searchParam[jsonData.searchColumns[i]]={
                    $regex: new RegExp(jsonData.search, "i")
                };
                objOr.push(searchParam);
            }
            queryArr.push({$or:objOr});
        }
        if(jsonData.filterBy) {
            objAnd = jsonData.filterBy;
        }
        queryArr.push(objAnd);
        queryObj['$and']=queryArr;
        let options = {
            sort: jsonData.sortBy,
            lean: false,
            page: jsonData.page > 0 ? jsonData.page : 1 ,
            limit: jsonData.pageSize
        };
        databaseCall['queryObj']=queryObj;
        databaseCall['options']=options;
        callback(null, databaseCall);
        return;
    };

    this.paginationRequest=function(data,key, callback) {
        let pageSize,page;
        if(data.pageSize) {
            pageSize = parseInt(data.pageSize);
            if (pageSize > commons.max_record_limit) {
                pageSize = commons.max_record_limit;
            }
        } else {
            pageSize = commons.record_limit;
        }
        if(data.page) {
            page = parseInt(data.page);
        } else {
            page = commons.skip_Records;
        }

        let sortBy={};
        if(data.sortBy) {
            sortBy[data.sortBy] = data.sortOrder == 'desc' ? -1 : 1;
        } else {
            sortBy[commons.sort_reference_data[key]] = commons.sort_order == 'desc' ? -1 : 1;
        }

        let request={
            'sortBy':sortBy,
            'mirrorSort' :sortBy,
            'page':page,
            'pageSize':pageSize,
            'id':key
        };
        let filterBy={};
        if(data.filterBy) {
            let a = data.filterBy.split(",");
            for (let i = 0; i < a.length; i++) {
                let b = a[i].split(":");
                let c = b[1].split("+");
                if (c.length > 1) {
                    filterBy[b[0]] = {'$in': c};
                } else {
                    filterBy[b[0]] = b[1];
                }
            }
            request['filterBy'] = filterBy;
        }
        if(data.search){
            request['search']=data.search;
        }
        if (typeof callback === 'function') {
            callback(null, request);
        }
    };
}

module.exports = new ApiUtil();
