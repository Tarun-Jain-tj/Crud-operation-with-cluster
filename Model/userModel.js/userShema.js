"use strict";
var mongoose = require('../../libs/dbUtils').getMongoDB();
var Schema = mongoose.Schema;
var schema = {};
module.exports = schema

//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;


var userSchema = new Schema({
    message: String,
    date: { type: Date, default: Date.now },
    email: String,
    password: String,
    token: { type: String, default: null }
});


schema.messageModel = mongoose.model('messages', userSchema);