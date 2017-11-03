var Route = require('../libs/core/Route');
var constant = require('../constant/constant');
var response = require('../constant/response');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var dataModel = require('../Model/messageModel/messagesQuery');
// define route
var route = new Route('post', '/sendEmail');
module.exports = route;

// route.use(function (req, res, next) {

//     dataModel.sendEmail(req.body.email, function (err, data) {
//         if (err) {
//             next(err);
//         }
//         else {
//             res.json(response(data, constant.messages.SUCCESS, constant.statusCodes.SUCCESS));
//         }
//     })
// })

route.use(function (req, res, next) {

    dataModel.sendEmail2(req.body.email).then((result) => {
        res.json(response(result, constant.messages.SUCCESS, constant.statusCodes.SUCCESS));
    })
        .catch(next);
})