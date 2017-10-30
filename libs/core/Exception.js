var util = require('util');
var lodash = require('lodash');

/**
 * Extract a message string representation out of the value.
 * @param {Object} value  - message value.
 * @returns {String}
 */
function toMessage(value){
    if(lodash.isString(value)){
       return value;
    }else{
       return  util.inspect(value,{ showHidden: false, depth: 1 });
    }
}

/**
 * Extract a cause representation as Error or String from given value.
 * @param {Object} value - error value
 * @returns {String|Error}
 */
function toCause(value){
    if(lodash.isString(value) || lodash.isError(value)){
        return value;
    }else{
        return  util.inspect(value,{ showHidden: false, depth: 1 });
    }
}

/**
 * The Exception class to represent errors.
 * @param {Object} message - error message.
 * @param {Object} cause - original cause, if any.
 * @constructor
 */
function Exception(message,cause){
    this.stack = Error.call(this).stack;
    this.message = toMessage(message);
    this.cause = toCause(cause);
    this.details = [];
}

/**
 * Default error message.
 * @type {string}
 */
Exception.DEFAULT_ERR_MSG = "Unknown Error";

// Inherits from Error
util.inherits(Exception,Error);

/**
 * Exception class.
 * @type {Exception}
 */
module.exports = Exception;

/**
 * Create an Exception instance out of an arbitrary throw value.
 * @param {Object} err - error value.
 * @returns {Exception}
 */
Exception.from = function(err){
   if(err instanceof Exception){
       return err;
   }

   if(lodash.isError(err)){
        return new Exception(err.message,err);
   }

   if(lodash.isString(err)){
       return new Exception(err);
   }

   return new Exception(Exception.DEFAULT_ERR_MSG,util.inspect(err,{ showHidden: false, depth: 1 }));
};

/**
 * Append one or more detail messages to Exception. An Exception can hold multiple detail messages.
 * @param {Object | [Object]} details - detail message to append.
 * @return {Exception}
 */
Exception.prototype.addDetails = function(details){
    var self = this;

    if(lodash.isArray(details)){
        details.forEach(function(d){
            self.details.push(toMessage(d));
        });
    }else {
        self.details.push(toMessage(details));
    }

    return self;
};


