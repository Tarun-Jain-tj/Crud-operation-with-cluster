var util = require('util');
var lodash = require('lodash');
var Exception = require('./Exception');
var ApiException = require('./ApiException');
var winston = require('winston');

/**
 * Error handler middleware, that responds appropriately to clients and logs errors to provided logger as well.
 * @param {winston.Logger} winstonLogger - instance of a winston logger.
 * @constructor
 */
function ErrorHandler(winstonLogger){
    if(!(winstonLogger instanceof winston.Logger)){
        throw new Error("winstonLogger must be a winston.Logger instance.");
    }

    this.logger = winstonLogger;
}

// Inherits from Object
util.inherits(ErrorHandler,Object);

/**
 * Error Handler class.
 * @type {ErrorHandler}
 */
module.exports = ErrorHandler;

/**
 * Logs the error to associated logger, using metadata from provided request and error object.
 * @param {Object} req - request.
 * @param {Exception} exception - Exception instance.
 */
ErrorHandler.prototype.log = function(req, exception){
    if(!lodash.isObject(req)){
        throw new Error("req must be a Request Object.");
    }

    if(!(exception instanceof Exception)){
        throw new Error("exception must be an Exception instance.");
    }

    // generate error metadata
    var metadata = {
        ip: req.ip,
        path: req.path,
        message: exception.message,
        details: exception.details,
        stack: exception.stack,
        cause: exception.cause
    };

    // log error to logger
    if(exception instanceof ApiException){
        metadata.error_code = exception.errorCode;
        this.logger.error(metadata.error_code,metadata);
    }else{
        this.logger.error(metadata.message,metadata);
    }

};

/**
 * If response headers have not already been sent, responds with appropriate API exception for the Exception.
 * @param {Object} res - response.
 * @param {Exception} exception - Exception instance.
 */
ErrorHandler.prototype.respond = function(res, exception){
    if(!lodash.isObject(res)){
        throw new Error("res must be a Request Object.");
    }

    if(!(exception instanceof Exception)){
        throw new Error("exception must be an Exception instance.");
    }

    // if response not dispatched yet
    if (!res.headersSent) {

        // convert to ApiException if needed
        var apiExp = exception instanceof ApiException ? exception : ApiException.newInternalError(exception);

        // send proper response
        res.status(apiExp.httpCode);
        res.json(apiExp.toResponseJSON());
    }
};

/**
 * Generates a middleware that handles errors propagated along middleware chain.
 * @return {Function}
 */
ErrorHandler.prototype.build = function(){
    var self = this;

    // make middleware function
    return function(err,req,res,next){

        // if error forwarded
        if(err !== null && err !== undefined) {

            // convert to Exception if needed
            var exception = Exception.from(err);

            // log the error to logger
           self.log(req,exception);

            // respond to client as well
            self.respond(res,exception);
        }

        // proceed as usual.
        next();
    };
};

