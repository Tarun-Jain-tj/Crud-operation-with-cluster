"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
    message: String,
    date: { type: Date, default: Date.now }
});


var messages = mongoose.model('messages', messageSchema);

module.exports = messages;