'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

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


model.sendEmail2 = function (fromUser, toUser, subject, content) {
    fromUser = 'tarun.jain@.com';
    toUser = 'bhanu.negi@.com';
    subject = 'Hello';
    return new Promise(function (resolve, reject) {
        var mailOptions = setMailContent(fromUser, toUser, subject, content);
        var transporter = nodemailer.createTransport(smtpTransport({
            host: 'localhost', // hostname
            secure: false, // use SSL
            port: '8080', // port for secure SMTP
            service: 'gmail',
            auth: {
                user: 'tarun.jain@.com',
                pass: ''
            },
            tls: {
                rejectUnauthorized: false
            }
        }));
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Server is ready to take our messages');
                // create reusable transporter object using the default SMTP transport

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    resolve(info);

                });
            }
        });
        function setMailContent(fromUser, toUser, subject, content) {
            var mailOptions = {
                from: fromUser, // sender address
                to: toUser, // list of receivers
                subject: subject, // Subject line
                text: content, // plain text body
                html: content, // html body
                attachments: [
                    {   // utf-8 string as an attachment
                        filename: 'text.txt',
                        content: 'hello world! Hi You got mail from node mailer'
                    },
                    {   // file on disk as an attachment
                        filename: 'text3.txt',
                        path: './file.txt' // stream this file
                    },
                    {   // filename and content type is derived from path
                        path: './file.txt'
                    }]
            };
            return mailOptions;
        }
    })
}


module.exports = model;