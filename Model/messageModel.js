"use strict";
var mongoose = require('../libs/dbUtils').getMongoDB();
var Schema = mongoose.Schema;
var schema = {};
module.exports = schema

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;


var messageSchema = new Schema({
    message: String,
    date: { type: Date, default: Date.now }
});


schema.messageModel = mongoose.model('messages', messageSchema);
//module.exports = messages;