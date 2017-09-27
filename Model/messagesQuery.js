var messagesModel = require('./messageModel');
var messagesQuery = {};
var Promise = require('bluebird');
//get the messages read
messagesQuery.findAnyField = function (query, reteriveOnly) {
    console.log('findAnyField');
    return new Promise(function (resolve, reject) {
        messagesModel.find(query, reteriveOnly, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        });
    });
};

//save the messages create
messagesQuery.addData = function (data) {
    return messagesModel(data).save();
};

//update
messagesQuery.updateAnyField = function (query, updateOnly) {
    return messagesModel.update(query, updateOnly).exec();
};

//delete 
messagesQuery.removeAnyField = function (query) {
    return messagesModel.remove(query).exec();
};


module.exports = messagesQuery;