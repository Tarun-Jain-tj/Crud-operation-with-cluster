var schedule = require('node-schedule');
var logger = require('./logger');
var jsforce = require('jsforce');
var model = require('../models/CMSmodel/index');
var config = require('config');
var waterfall = require('async-waterfall');
var nconf = require('nconf');
var utils = require("./core/utility");
var async = require('async');

var conn = new jsforce.Connection({
    loginUrl: config.get("SalesForce.loginURL")
});
var CurrentSyncDate;
var cron = {};
module.exports = cron;



/**
 * executes a cron job for provided methods .
 * @param {function(Error,[Object])} callback
 */
cron.executeCron = function () {

    logger.error("Setting Cron function");
    var rule = new schedule.RecurrenceRule();
    minutes = config.get("Cron.setMinutes")
    rule.minute = new schedule.Range(0, 59, minutes);
      //schedule.scheduleJob(rule, function () {
    cron.startCronJob();
    // });
};


/**
 * executes a cron job for provided methods .
 * @param {function(Error,[Object])} callback
 */
cron.executeCalendarCron = function () {

    logger.error("Starting Calendar function");
    //var rule = new schedule.RecurrenceRule();
    //var  minutes = 720;
    //rule.minute = new schedule.Range(0, 59, minutes);
     schedule.scheduleJob('0 0 */2 * * *', function () {
      cron.syncCalendarEvents();
    });
};


cron.startCronJob = function () {
    CurrentSyncDate = new Date().toISOString();
    console.log(CurrentSyncDate);
    waterfall([
        cron.login,
        cron.fetchMandates,
        cron.fetchStageHistory,
        cron.fetchOpportunities,
        cron.fetchOpportunitiesMeetings,
        cron.SetSyncDate,
        cron.logOut

    ], function (err, result) {
        if (err)
            console.log(err);
        else {
            console.log("result", result);
        }
    });
};

cron.GetSyncDate = function (callback) {
    nconf.use('file', { file: './config/cronconfig.json' });
    nconf.load();
    return nconf.get('SyncDate');
}


cron.SetSyncDate = function (result, callback) {
    nconf.use('file', { file: './config/cronconfig.json' });
    nconf.load();
    nconf.set('SyncDate', CurrentSyncDate);
    nconf.save(function (err) {
        if (err) {
            console.error(err.message);
            callback(err.message, null);
            return;
        }
        console.log('Configuration saved successfully.');
        callback(null, 'Configuration saved successfully.');
    });
}


/**
 * login to salesforce api.
 * @param {function(Error,[Object])} callback
 */
cron.login = function (callback) {
    console.log("in login");
    var username = config.get("SalesForce.username"),
        passwords ="#\"W:TzQan=L/C9!r_R\\cfGaNc[DHM3a2",
        password = config.get("SalesForce.password");
    
    conn.login(username, passwords, function (err, info) {

        if (err) {
            callback(err, null);
            return;
        }
       
        callback(null, info);


    });
}


/**
 * logout from salesforce api.
 * @param {function(Error,[Object])} callback
 */
cron.logOut = function (result, callback) {
    console.log("in log out");
    conn.logout(function (err) {
        if (err) {
            logger.error("logout err", err);
            return callback(err, null);
        }
        callback(null, "Logout Successfully");
    });
}





/**
 * fetch all Mandates.
 * @param {function(Error,[Object])} callback
 */
cron.fetchMandates = function (result, callback) {
    var query = "SELECT Id,Name,Target_Size__c,Total_Closed_Opportunity_Amount__c,Base_CCY__c,Asset_Class__c,Logo_URL__c,Origination_Stage__c FROM Mandate__c ";

    var lastsyncDate = cron.GetSyncDate();
    console.log(lastsyncDate);
    if (lastsyncDate != null) {
        query = "SELECT Id,Name,Target_Size__c,Total_Closed_Opportunity_Amount__c,Base_CCY__c,Asset_Class__c,Logo_URL__c,Origination_Stage__c FROM Mandate__c where  LastModifiedDate > " + lastsyncDate;
    }
    executeQuery(query,
        function (records) {
            model.saveMandates(records, function (err, data) {
                if (err) {
                    logger.error("error in saving mandates", err);
                    console.log(err);
                    callback(err, null);

                }
                else {

                    console.log(data);
                    callback(null, "data saved");

                }
            });
        },
        true,
        4000);
}


/**
 * fetch all opportunities.
 * @param {function(Error,[Object])} callback
 */

cron.fetchOpportunities = function (result, callback) {
    console.log("IN fetchOpportunities");
    var query = "SELECT Id,Name,Owner.Name,Amount_m__c,Mandate__c,StageName,Tier__c,Country__c,Subtype__c, Average_Ticket_Size__c,Region__c,LastModifiedDate FROM Opportunity";

    var lastsyncDate = cron.GetSyncDate();
    console.log(lastsyncDate);
    if (lastsyncDate != null) {
        query = "SELECT Id,Name,Owner.Name,Amount_m__c,Mandate__c,StageName,Tier__c,Country__c,Subtype__c ,Average_Ticket_Size__c,Region__c,LastModifiedDate FROM Opportunity where  LastModifiedDate > " + lastsyncDate;
    }

    console.log(query);
    executeQuery(query,
        function (records) {
            model.saveOpportunities(records, function (err, data) {
                if (err) {
                    console.log("error in saving Opportunities", err);
                    callback(err, null);
                }
                else {
                    console.log(data);
                    callback(null, "data saved");
                }
            });
        },
        true,
        30000);
}

/**
 * fetch all stageHistory.
 * @param {function(Error,[Object])} callback
 */

cron.fetchStageHistory = function (result, callback) {
    console.log("IN Fetch Stage History");
    var lastsyncDate = cron.GetSyncDate();
    var query = "Select ID,OpportunityId,Opportunity.Name, NewValue,OldValue,CreatedDate FROM OpportunityFieldHistory where Field='StageName'";
    if (lastsyncDate != null) {
        query = "Select ID,OpportunityId,Opportunity.Name, NewValue,OldValue,CreatedDate FROM OpportunityFieldHistory where Field='StageName' AND CreatedDate >" + lastsyncDate;
    }
    executeQuery(query,
        function (records) {

            model.saveStageHistory(records, function (err, data) {
                if (err) {
                    logger.error("error in saving Stage History", err);
                    callback(err, null);
                }
                else {
                    console.log("data saved");
                    callback(null, "data saved");
                }
            });

        },
        true,
        30000);
}

/**
 * fetch all opportunities meetings.
 * @param {function(Error,[Object])} callback
 */

cron.fetchOpportunitiesMeetings = function (result, callback) {

    var query = "Select Id,Opportunity__c,Opportunity__r.Name,Pre_Meeting_Note_Title__c,Upload_pre_meeting_note__c,Post_Meeting_Note_Title__c,Upload_post_meeting_note__c, CreatedDate ,LastModifiedDate from Meeting_Tracker__c";
    var lastsyncDate = cron.GetSyncDate();
    if (lastsyncDate != null) {
        query = "Select Id,Opportunity__c,Opportunity__r.Name,Pre_Meeting_Note_Title__c,Upload_pre_meeting_note__c,Post_Meeting_Note_Title__c,Upload_post_meeting_note__c, CreatedDate ,LastModifiedDate from Meeting_Tracker__c  where  LastModifiedDate >" + lastsyncDate;
    }
    executeQuery(query,
        function (records) {


            model.saveMeetings(records, function (err, data) {
                if (err) {
                    logger.error("error in saving Opportunities", err);
                    callback(err, null);
                }
                else {
                    callback(null, "data saved");
                }
            });

        },
        true,
        30000);
}



/**
 * sync calendar events.
 * @param {function(Error,[Object])} callback
 */

cron.syncCalendarEvents = function () {
   
        model.getAllCalendarURLs(function (err, data) {
            if (err) {
                logger.error("Calendar error",err);
            }
            else if (data.length) {
                async.forEachOf(data, function (URL, index, callback) {
				    console.log("Calendar URL " + URL);
					
                   utils.getCalendarEvents(URL, function (err, result) {
                        if (err) {
                            logger.error("Calendar error",err);
                        }
                        else if (result.length) {
                            model.addCalendarEvents(result, function (err, data) {
                                if (err) {
                                    logger.error("addCalendarEvents sync error ", err);
                                    callback(err, null);
                                }

                                else {
								    console.log("Event Added for "+ URL);
                                    model.getEventsIDs(result,function(err,record){
                                        if(err){
                                            logger.error("getCalendarEvents sync error ", err);
                                            callback(err, null);
                                        }
                                       else if(record.length){
                                           model.deleteEvents(record,URL,function(err,response){
                                               if(err){
                                                   callback(err, null);
                                               }
                                               else{
                                                   callback(null, "Deleted");
                                               }
                                           });
                                           
                                       } 
                                        
                                    });
                                    
                                }
                            });
                        }

                        else {
                            callback(null, "Nothing to add");
                        }


                    });

                }, function (err) {
                    if (err) {
                        logger.error("calendar sync error ", err);
                    }

                   console.log("Calendar Event Finish");
                });

            }
            else {
                console.log("No urls found")
                
            }
        });
    
};


/**
 * utility method for fetching records.
 * @param {function(Error,[Object])} callback
 */

function executeQuery(query, callback, autoFetch, maxFetch) {
    console.log("in");
    var records = [];
    var query = conn.query(query)
        .on("record", function (record) {
            records.push(record);
        })
        .on("end", function () {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);

            callback(records);
        })
        .on("error", function (err) {
            console.log("error", err);
            logger.error("error ", err);
        })
        .run({
            autoFetch: autoFetch,
            maxFetch: maxFetch
        });

}