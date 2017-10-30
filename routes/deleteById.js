var Route = require('../libs/core/Route');
var dataModel = require('../Model/messagesQuery');
var constant = require('../constant/constant');
var response = require('../constant/response');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var async = require('async');
// define route
var route = new Route('delete', '/data/delete');
module.exports = route;


route.use(function (req, res, next) {
    dataModel.removeFieldByID(req.body, function (err, data) {
        if (err) {
            next(err);
        }
        else {
            res.json(response(data, constant.messages.SUCCESS, constant.statusCodes.SUCCESS));
        }
    });
});




