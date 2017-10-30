var util = require('util');
var lodash = require('lodash');
var pitstop = require('pitstop');
var routePattern = require('route-pattern');

/**
 * Whitelist allows for applying conditional middleware chains on all incoming requests,
 * except the request paths(routes) which have been white-listed.
 * Once configured, Whitelist generates a combined middleware to be plugged into main middleware chain of the app.
 *
 * Typical example is applying some Authorization checking middleware to all incoming requests,
 * except few public paths (such as /login) marked as white-listed, for which checking middleware will be bypassed.
 *
 * This implementation internally uses 'pitstop' module.
 * @constructor
 */
function Whitelist(){
    this.paths = [];
    this.middlewares = [];
}

// Inherits from Object
util.inherits(Whitelist,Object);

/**
 * Whitelist class.
 * @type {Whitelist}
 */
module.exports = Whitelist;

/**
 * Add middleware to execute on requests.
 * @param {Function} middleware - middleware function.
 * @returns {Whitelist}
 */
Whitelist.prototype.use = function(middleware){
    if(!lodash.isFunction(middleware)){
        throw new Error("middleware must be a Function.");
    }

    this.middlewares.push(middleware);

    return this;
};

/**
 * Add request path(s) to white list. Paths may use wildcard patterns.
 * @param {String | [String]} paths - path, or array of paths.
 * @returns {Whitelist}
 */
Whitelist.prototype.allow = function(paths){
    if(!lodash.isString(paths) && !(lodash.isArray(paths) && lodash.all(paths,lodash.isString))){
        throw new Error("paths must be a String or an Array of Strings.");
    }

    // append to white list
    this.paths = this.paths.concat(paths);

    return this;
};

/**
 * Returns a combined middleware for white-list configuration.
 * @returns {Function}
 */
Whitelist.prototype.build = function(){
    var self = this;

    // make a middleware using pitstop
    return pitstop(this.middlewares,function(req,res,next){

        // check if request path matches any path pattern in allowed paths
        var matches = lodash.some(self.paths,function(p){
            return routePattern.fromString(p).matches(req.path);
        });

        if(matches){
            // request path is in allowed paths, skip the middle-wares
            next(false);
        }else{
            // request path is NOT in allowed paths, include the middle-wares
            next(true);
        }
    });
};