var messageQueries = require('../Model/messagesQuery');
var messageController = {};
var debug = require('debug');
var mongoose = require('mongoose');

//save the messages
messageController.save = function (req, res, next) {
    var data = {
        message: req.body.message
    };
    return messageQueries.addData(data)
        .then(function (result) {
            res.result = result;
            return next();
        }).catch(function (error) {
            res.result = {
                error:error+"",
                message:"internal server error",
                code:500
            }
            return next();
        });
};

//get the messages
messageController.getAllMessages = function (req, res, next) {
    console.log(req.tarun);
    var query = {};
    var reteriveOnly = {};
    return messageQueries.findAnyField(query, reteriveOnly)
        .then(function (result) {
            res.result = result;
            return next();
        }).catch(function (error) {
            res.result = error + "";
            return next(error);
        });
};

//update the messages
messageController.update = function (req, res, next) {
    var query = {_id:req.body.id};
    var updateOnly = {message:req.body.message};
    return messageQueries.updateAnyField(query, updateOnly)
        .then(function (result) {
            res.result = result;
            return next();
        }).catch(function (error) {
            res.result = error + "";
            return next(error);
        });
};

//remove the messages
messageController.remove = function (req, res, next) {
    var query = {_id:mongoose.Types.ObjectId(req.body.id)};
    console.log("query",query);
    return messageQueries.removeAnyField(query)
        .then(function (result) {
            res.result = result;
            return next();
        }).catch(function (error) {
            res.result = error + "";
            return next(error);
        });
};
module.exports = messageController;