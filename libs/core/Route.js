var lodash = require('lodash');
var wrench = require('wrench');
var fs = require('fs');
var util = require('util');
var path = require('path');

/**
 * Defines a request handling route, internally uses an ExpressJs Router instance.
 * @param {String} method - HTTP method. E.g. 'get', 'post' etc.
 * @param {String} path - Request route path. E.g. '/login'.
 * @constructor
 */
function Route(method,path){

    if(!lodash.includes(Route.REQUEST_METHODS,method)){
        throw new Error("method must be one of:["+Route.REQUEST_METHODS.join(",")+"]");
    }

    if(!lodash.isString(path)){
        throw new Error("path must be a String");
    }

    this.middlewares = [];
    this.method = method;
    this.path = path;
}

// Inherits from Object
util.inherits(Route,Object);

/**
 * Route class.
 * @type {Route}
 */
module.exports = Route;

/**
 * Allowed HTTP methods for Route.
 * @type {string[]}
 */
Route.REQUEST_METHODS = ['get','post','put','delete','head'];

/**
 * Use one or more middleware on this route. This simply calls use() of internal Router instance with same arguments.
 */
Route.prototype.use = function(){

    for(var i = 0; i < arguments.length; i++){
        var mw = arguments[i];
        if(lodash.isFunction(mw)){
            this.middlewares.push(mw);
        }else{
            throw new Error("Arguments should be middleware functions");
        }
    }

};

/**
 * Mount router of this route on given parent router using this Route's method and path.
 * @param {Object} router - parent router.
 */
Route.prototype.mount = function(router){
    router[this.method](this.path,this.middlewares);
};

/**
 * Scan the given directory, require all Route modules in it and return all of them as an array.
 * This function blocks until done.
 * @param {String} rootPath - root file path to scan.
 * @param {Boolean} recursive - true to scan recursively, false for no recursion.
 * @return {[Route]} route modules array.
 */
Route.scanAll = function(rootPath,recursive){
    var files = [];

    if(recursive){
        files = wrench.readdirSyncRecursive(rootPath);
    }else{
        files = fs.readdirSync(rootPath);
    }

    var routes = [];

    files.forEach(function(f){

        f = path.join(rootPath,f);

        var stat = fs.lstatSync(f);

        if(stat.isFile() && path.extname(f) === '.js'){

            var module = require(f);
            if(module instanceof Route){
                routes.push(module);
            }else{
                throw new Error("scan path must contain only Route type modules, found "+(typeof module));
            }

        }
    });

    return routes;
};
