var ApiException = require('../libs/core/ApiException');
var apiErrors = require('../assets/api_errors');
var lodash = require('lodash');
var config = require('config');
var model = require('../Model/messageModel');
var utils=require("./core/utility");
// define module
function authUtil(){}
module.exports = authUtil;

/**
 * Ensures there is a valid api_key in request headers or url query params.
 * @param req - express request.
 * @param res - express response.
 * @param next - express next.
 * @return {*}
 */
authUtil.verifyApiKey = function(req,res,next){
    // get api_key from header or url query parameter if present
    var apiKey = req.get('api_key') || req.query.api_key;

    // api key must be provided
    if(apiKey === null || apiKey === undefined){
        return next(ApiException.newUnauthorizedError(apiErrors.api_key_required.error_code,null));
    }

    // defined api keys
    var apiKeys = config.get('api_keys');

    //check for valid api_key
    var valid = lodash.some(lodash.keys(apiKeys),function(ak){
        var value = apiKeys[ak];
        if(value === apiKey){
            req.client_type = ak;
            return true;
        }else{
            return false;
        }
    });

    if(valid) {
        return next();
    } else {
        return next(ApiException.newTokenExpiryError(apiErrors.token_expired.error_code,null));
    }
};

/**
 * Ensures there is a valid auth_token in request headers or url query params.
 * @param req - express request.
 * @param res - express response.
 * @param next - express next.
 * @return {*}
 */
authUtil.verifyAuthToken = function(req,res,next){

    // get auth_token from header or url query parameter if present
    var authToken = req.headers['access_token'] || req.query.access_token;
    // auth_token must be provided
    if(authToken === null || authToken === undefined){
        return next(ApiException.newUnauthorizedError(apiErrors.auth_token_required.error_code,null));
    }
     
    // ping the auth token
    model.findAuthToken(authToken,function(err,auth){
       if(err){
           next(err);
       }else if (auth.length == 0){
           // no matching auth token found
           next(ApiException.newUnauthorizedError(apiErrors.invalid_auth_token.error_code,null));
       }else{

        //    var currentDate = new Date();
        //    var timeDifference = utils.timeDifference(currentDate, auth[0].expiryDate);
        //    var expiryTime = config.get('constraints.token_expiry_hours');
             
        //    if(timeDifference > expiryTime)
        //    {
        //      next(ApiException.newTokenExpiryError(apiErrors.token_expired.error_code,null));
        //    }
             // increase token expiry time on each request
        //    else{

        //           model.increaseTokenExpiryTime(authToken,function(err,data){
        //             if(err){
        //               next(err);
        //             }
        //             else{

                      //save authentication info in request
                      req.auth = authToken;
                      next();
                //     }

                //   });
           //}
           
           
       }
    });
};
