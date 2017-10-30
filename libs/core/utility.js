var fs = require('fs');
var uscore = require('underscore');
var stringify = require('json-stringify-safe');
var ews = require('ews-javascript-api');
var appUtils = require('../appUtils');


var util = {};

util.timeDifference = function (currentDate, tokenExpiryDate) {
    var difference = currentDate.getTime() - tokenExpiryDate.getTime();
    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;
    return hoursDifference;
};

util.daysDifference = function (passwordCreatedDate) {


    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var currentDate = new Date();
    var createdDate = new Date(passwordCreatedDate);
    var diffDays = Math.round(Math.abs((currentDate.getTime() - createdDate.getTime()) / (oneDay)));
    return diffDays;
}

util.getCalendarEvents = function (calendarURL, callback) {

    var startMonth = -1, endMonth = 3;
    var exch = appUtils.getExchangeObject(),
        calenderFolderId = new ews.FolderId(ews.WellKnownFolderName.Calendar, new ews.Mailbox(calendarURL));
    // console.log(calenderFolderId);
    exch.ResolveName(calendarURL).then(function (response) {
        if (response.Items.length > 0) {
            //console.log(response.Items[0].owner.Items.length);
            // if (response.Items[0].Mailbox && response.Items[0].Mailbox.MailboxType === ews.MailboxType.Mailbox ) {
            exch.FindAppointments(calenderFolderId,
                new ews.CalendarView(ews.DateTime.Now.Add(startMonth, "month"),
                    ews.DateTime.Now.Add(endMonth, "month")))
                .then(function (params) {
                    console.log(params.totalCount);
                    //  console.log("syncing " + response.Items.length + " events for " + calendarURL);
                    var propSet = new ews.PropertySet(ews.BasePropertySet.IdOnly);
                    if (params.totalCount > 0 && params.items && params.items.length) {
                        propSet.Add(ews.AppointmentSchema.Id);
                        propSet.Add(ews.AppointmentSchema.Subject);
                        propSet.Add(ews.AppointmentSchema.Body);
                        propSet.Add(ews.AppointmentSchema.Start);
                        propSet.Add(ews.AppointmentSchema.End);
                        propSet.Add(ews.AppointmentSchema.Location);
                        propSet.Add(ews.AppointmentSchema.RequiredAttendees);
                        propSet.Add(ews.AppointmentSchema.OptionalAttendees);
                        exch.LoadPropertiesForItems(params.Items, propSet)
                            .then(function (data) {
                                var dataToSend = JSON.parse(stringify(data));
                                if (dataToSend.responses.length) {

                                    var mappedData = dataToSend.responses.map(function (data) {
                                        var attendees;
                                        if (data.item.propertyBag.properties.objects.RequiredAttendees && data.item.propertyBag.properties.objects.RequiredAttendees.items.length) {
                                            attendees = data.item.propertyBag.properties.objects.RequiredAttendees.items.map(function (result) {
                                                return {
                                                    "Name": result.name,
                                                    "Address": result.address
                                                }
                                            });
                                        }
                                        return {
                                            "EventId": data.item.propertyBag.properties.objects.Id.UniqueId,
                                            "CalendarURL": calendarURL,
                                            "Subject": data.item.propertyBag.properties.objects.Subject,
                                            "Body": data.item.propertyBag.properties.objects.Body ? data.item.propertyBag.properties.objects.Body.text : null,
                                            "StartTime": data.item.propertyBag.properties.objects.Start.momentDate,
                                            "Location": data.item.propertyBag.properties.objects.Location,
                                            "Attendees": attendees
                                        }

                                    });
                                    var result = (JSON.parse(stringify(mappedData)));
                                    console.log("syncing " + result.length + " events for " + calendarURL);
                                    callback(null, result);
                                }
                            }, function (err) {
                                console.log(err);
                                callback(null, []);
                            });
                    }
                    else {
                        console.log("No items found " + calendarURL);
                        callback(null, []);
                    }

                }, function (err) {
                    console.log("In Exception Custome " + err);
                    callback(null, []);
                });
        }
        else {
            console.log(calendarURL + " not found on this exchange.");
            callback(null, []);
        }
    }, function (error) {
        console.log("ERROR");
        callback(null, []);
    });

}

module.exports = util;