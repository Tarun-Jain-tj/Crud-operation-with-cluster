var util = require('util');
var lodash = require('lodash');
var Exception = require('./Exception');

/**
 * Represents an API level exception. That can be conveyed back to clients.
 * This class contains static utility methods to create common API level exception instances.
 *
 * @param {Number} httpCode - HTTP status code.
 * @param {String} errorCode - Error code.  Clients need to have a mapping of all error codes.
 * @param {String} message - error message.
 * @param {Object} cause - error cause, if any.
 * @constructor
 */
function ApiException(httpCode, errorCode, message, cause) {
    Exception.call(this, message, cause);
    
    if (!lodash.isNumber(httpCode)) {
        throw new Error("httpCode must be a number.");
    }
    
    if (!lodash.isString(errorCode)) {
        throw new Error("errorCode must be a string.");
    }
    
    this.httpCode = httpCode;
    this.errorCode = errorCode;
}

// Inherits Exception
util.inherits(ApiException, Exception);

/**
 * ApiException class.
 * @type {ApiException}
 */
module.exports = ApiException;

/**
 * Get JSON representation of API exception that can be sent to API clients.
 * @return {{error_code: *, message: *, details: *}}
 */
ApiException.prototype.toResponseJSON = function () {
    
    // return {
    //     Status: this.httpCode,
    //     Messsage: this.message,
    //     Data: null
    // };
    return {
       'error_code':this.errorCode,
       'Message':this.message,
       'Data':this.details,
       'Status': this.httpCode
    };
};

// constants
ApiException.SC_BAD_REQUEST = 400;
ApiException.MSG_BAD_REQUEST = "Invalid Input.";
ApiException.EC_BAD_REQUEST = "INVALID_INPUT";

ApiException.SC_UNAUTHORIZED = 401;
ApiException.MSG_UNAUTHORIZED = "Access Denied.";

ApiException.SC_TOKENEXPIRY = 401;
ApiException.MSG_SC_TOKENEXPIRY = "Token Expired.";

ApiException.SC_FORBIDDEN = 403;
ApiException.MSG_FORBIDDEN = "Operation not allowed.";

ApiException.SC_NOT_FOUND = 404;
ApiException.MSG_NOT_FOUND = "Resource not found.";
ApiException.EC__NOT_FOUND = "NOT_FOUND";

ApiException.SC_INTERNAL_ERROR = 500;
ApiException.MSG_INTERNAL_ERROR = "Internal server error.";
ApiException.EC_INTERNAL_ERROR = "INTERNAL_ERROR";

/**
 * Create a new API Exception for invalid input to API.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newBadRequestError = function (cause) {
    return new ApiException(ApiException.SC_BAD_REQUEST, ApiException.EC_BAD_REQUEST, ApiException.MSG_BAD_REQUEST, cause);
};

/**
 * Create a new API Exception for unauthorised access to API.
 * @param {String} errorCode - error code.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newUnauthorizedError = function (errorCode, cause) {
    return new ApiException(ApiException.SC_UNAUTHORIZED, errorCode, ApiException.MSG_UNAUTHORIZED, cause);
};

/**
 * Create a new API Exception for expiry of token .
 * @param {String} errorCode - error code.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newTokenExpiryError = function (errorCode, cause) {
    return new ApiException(ApiException.SC_TOKENEXPIRY, errorCode, ApiException.MSG_SC_TOKENEXPIRY, cause);
};

/**
 * Create a new API Exception for operation not allowed by API.
 * @param {String} errorCode - error code.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newNotAllowedError = function (errorCode, cause) {
    return new ApiException(ApiException.SC_FORBIDDEN, errorCode, ApiException.MSG_FORBIDDEN, cause);
};

/**
 * Create a new API Exception for resource not found on API.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newNotFoundError = function (cause) {
    return new ApiException(ApiException.SC_NOT_FOUND, ApiException.EC__NOT_FOUND, ApiException.MSG_NOT_FOUND, cause);
};

/**
 * Create a new API Exception for internal API error.
 * @param {Object} cause - optional cause.
 * @returns {ApiException}
 */
ApiException.newInternalError = function (cause) {
    return new ApiException(ApiException.SC_INTERNAL_ERROR, ApiException.EC_INTERNAL_ERROR, ApiException.MSG_INTERNAL_ERROR, cause);
};