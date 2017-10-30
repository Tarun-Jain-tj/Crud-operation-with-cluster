var Route = require('../libs/core/Route');
var dataModel = require('../Model/messagesQuery');
var constant = require('../constant/constant');
var response = require('../constant/response');
var Check = require('../libs/core/Check');
var appUtils = require('../libs/appUtils');
var async = require('async');
// define route
var route = new Route('get', '/data/details');
module.exports = route;

//Preliminary data type checks
// route.use(function (req, res, next) {  
//     var input = req.query;
//     var rules = {
//         mandateId: Check.that(input.mandateId).isNotEmptyOrBlank()
//     };

//     appUtils.validateChecks(rules, next);

// });

// fetch and send count

/**
 * @apiDescription
 * Api for Get All Salesman.
 * @api {get} /api/data/getAllSalesman Get All Salesman
 * @apiPermission none
 * @apiVersion 1.0.0
 * @apiName Get All Salesman
 * @apiGroup Data
 * @apiHeader {String} api_key Api key for authentication.
 * @apiSuccess {Array}  data Data returned from API
 * @apiSuccess {string}  data[0].name Contains name of salesman
 * @apiSuccess {string}  data[0].sfId Contains salesforce Id
 * @apiSuccess {string}  data[0].fullPhotoUrl Contains fullPhotoUrl url
 * @apiSuccess {string}  data[0]._id Contains _id 
 * @apiSuccess {Number} status API status
 * @apiSuccess {String} Message API Message
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *{
 * "Data":[
 *{
 *   "_id": "593537a4dd012212104a42b3",
 *     "sfId": "a0Yg0000003m5gbEAA",
 *     "createdDate": "2017-05-30T10:35:38.000Z",
 *     "currencyIsoCode": "GBP",
 *     "lastModifiedDate": "2017-05-30T10:35:38.000Z",
 *     "name": "James Ross",
 *     "salesTeam": "New Sales Team",
 *     "salesmanEmail": "james.ross@centtrip.com",
 *     "fullPhotoUrl": null,
 *     "smallPhotoUrl": null,
 *     "ModifiedOn": "2017-06-05T10:51:16.057Z"
 *  }
 * "Message": "Success",
 * "Status": 200
 * }
 *@apiError ERR_API_KEY_INVALID Api key is not valid.
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.2 404 Not Found
 */
route.use(function (req, res, next) {
    dataModel.getAllFeilds()
        .then(function (result) {
            res.json(response(result, constant.messages.SUCCESS, constant.statusCodes.SUCCESS));
        })
        .catch(function (error) {
            next(error);
        });
});


