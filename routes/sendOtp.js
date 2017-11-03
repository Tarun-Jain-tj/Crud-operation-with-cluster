var Route = require('../libs/core/Route');
var constant = require('../constant/constant');
var response = require('../constant/response');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var otpService = require('../libs/otp');
// define route
var route = new Route('get', '/sendOtp');
module.exports = route;

route.use(function (req, res, next) {
    otpService.SendOtp();
});