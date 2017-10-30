var schema = require('./messageModel');
var model = {};
var Promise = require('bluebird');
//get the messages read
model.findAnyField = function (query, reteriveOnly) {
    console.log('findAnyField');
    return new Promise(function (resolve, reject) {
        schema.messageModel.find(query, reteriveOnly, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        });
    });
};

model.getAllFeilds = function () {
    console.log('findAnyField');
    return new Promise(function (resolve, reject) {
        schema.messageModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        });
    });
};

//save the messages create
model.addData = function (data, cb) {
    return new schema.messageModel(
        {
            "message": data.message
        }).save(function (err, result) {

            if (result) {
                cb(null, result);
            }
            else {
                cb(err);
            }
        });//call back in save function
    //return schema(messageModel.data).save();
};

//update
model.updateById = function (data, cb) {
    return schema.messageModel.update({ "_id": data.id },
        {
            $set: {
                "message": data.message
            }
        }, { upsert: true }, cb);
};

//delete 
model.removeFieldByID = function (data, cb) {
    return schema.messageModel.remove({ "_id": data.id }).exec(cb);
};


module.exports = model;