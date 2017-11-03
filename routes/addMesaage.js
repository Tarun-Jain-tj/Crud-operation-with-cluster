var Route = require('../libs/core/Route');
var dataModel = require('../Model/messageModel/messagesQuery');
var constant = require('../constant/constant');
var response = require('../constant/response');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var async = require('async');
// define route
var route = new Route('post', '/data/insert');
module.exports = route;

route.use(function (req, res, next) {
  var input = req.body;
  var rules = {
    message: Check.that(input.message).isNotEmptyOrBlank()
  };

  appUtils.validateChecks(rules, next);

});

//Sanitize
route.use(function (req, res, next) {

  // Trim
  if (req.body.message) {
    req.message = req.body.message.trim().toLowerCase();
  }
  next();
});

route.use(function (req, res, next) {
  dataModel.addData(req.body, function (err, data) {
    if (err) {
      next(err);
    }
    else {
      res.json(response(data, constant.messages.SUCCESS, constant.statusCodes.SUCCESS));
    }
  });
});




