//var mysql = require("mysql");
var config = require("config");
//var randomString=require('shortid');
var mongoose = require('mongoose');

// First you need to create a connection to the mongo db
var option = {
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    }
};
var mongoDB = mongoose.connect(config.get("mongoDB.url"), option, function (error, cb) {

    if (error) {
        console.log(error);
    }
    else {
        console.log("connected to db");
    }
});

//  /**
//  * Run query for a page of results using skip and limit values.
//  * The result to callback is an object that contains skip,limit,hasPrev,hasNext and objects array (query results).
//  * @param {Object} conditions - mongo query.
//  * @param {Object} projection - mongo projection, can be null.
//  * @param {Object} options - mongo query options, with properties skip and limit. Can be null.
//  * @param {function(Error,{count:number,skip:number,limit:number,hasPrev:boolean,hasNext:boolean,objects:[*]})} callback - callback function.
//  */
/*mongoose.Query.prototype.paginate = function(skip, limit, callback){
    
     // sanitize value as per app constraints
    skip = appUtils.ensureSkip(skip);
    limit = appUtils.ensureLimit(limit);
    
    // param values
    var skp = skip;
    var lmt = limit;

    // fetch one extra record from both ends of results
    if(skip > 0){
        skp--;
        lmt++;
    }
    lmt++;
    
    var query = this;
    
    return query.skip(skp).limit(lmt).exec(function(err,results){
        if(err){
            callback(err,undefined);
        }else{
            var hasPrev = false;
            var hasNext = false;

            if(skp < skip){
                // there will always be previous if skip > 0 and we got some records.
                hasPrev = results.length > 0;

                // drop first record, if an extra was fetched before start point.
                results = lodash.drop(results,1);
            }

            if(results.length > limit){
                // there will be an extra record at the end as well, if we got more than we asked for.
                hasNext = true;

                //drop last record, if an extra was fetched after end point.
                results = lodash.dropRight(results,1);
            }

            // add metadata and return results.
            callback(undefined,{
                count:results.length,
                skip:skip,
                limit:limit,
                hasPrev:hasPrev,
                hasNext:hasNext,
                objects:results
            });
        }
    });
}
*/

var dbUtils = {};

/**
 * Returns Mongo DB driver instance
 * @return {mongoose}
 */
dbUtils.getMongoDB = function () {
    return mongoDB;
};
module.exports = dbUtils;
