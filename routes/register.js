var Route = require('../../libs/core/Route');
var model = require('../../models/Register/index');
var CMSModel = require('../../models/CMSmodel/index');
var Check = require('../../libs/core/Check');
var config = require('config');
var appUtils = require('../../libs/appUtils');
var constant = require('../../constant/constant');
var response = require('../../constant/response');
var emailNotifier = require('../../notify/emailNotifier');
var bcrypt = require('bcrypt-nodejs');
var password;
// define route
var route = new Route('post', '/user/register');
module.exports = route;
// //helper method
// var  removeUser=function(req,res,next,id)
//                 {
//                     model.removeUser(id,function(err,result){
//                         if(err)
//                           next(err);
//                       res.json(response(null,constant.messages.REGISTRATIONFAIL,constant.statusCodes.SUCCESS));
//                     });
//                 }; 


// //Preliminary data type checks
// route.use(function (req, res, next) {
//     var input = req.body;
//     var minPassLength = config.get('constraints.user_password_length');
//     var rules = {
//         email: Check.that(input.email).isEmail(),
//         name: Check.that(input.name).isNotEmptyOrBlank(),
//         //employeeId: Check.that(input.employeeId).isNotEmptyOrBlank(),
//         //jobTitle: Check.that(input.jobTitle).isNotEmptyOrBlank(),
//         userName: Check.that(input.userName).isNotEmptyOrBlank(),
//         phoneNumber: Check.that(input.phoneNumber).isNotEmptyOrBlank(),
//         password: Check.that(input.password).isNotEmptyOrBlank().isLengthInRange(minPassLength, 256),
//         role: Check.that(input.role).isEnum([1,2,3])
//     };
//     appUtils.validateChecks(rules, next);
    
// });

// //Sanitize
// route.use(function (req, res, next) {
    
//     // Trim
//     if (req.body.email) {
//         req.body.email = req.body.email.trim().toLowerCase();
//     }
//     if (req.body.name) {
//         req.body.name = req.body.name.trim();
//     }
//      if (req.body.userName) {
//         req.body.lastName = req.body.userName.trim();
//     }
//     if (req.body.password) {
//         req.body.password = req.body.password.trim();
//     }
//     if (req.body.phoneNumber) {
//         req.body.phoneNumber = req.body.phoneNumber.trim();
//     }
   
//     next();
// });

// // check if email already exist
// route.use(function (req, res, next) {
//     model.findOneForEmail(req.body.email, function (err, records) {
//         if (err) {
           
//             next(err);
           
           
//         } else if (records.length > 0) {
           
//             res.json(response(null,constant.messages.ALREADYEXIST,constant.statusCodes.MULTI_STATUS));
     
//         } else {
//             next();
//         }
//     });
// });


// //encrypt password
// route.use(function (req, res, next) {
//     password = req.body.password;
//     bcrypt.hash(req.body.password, null, null, function (err, hash) {
//         if (err) 
//         next(err);
//         req.body.password = hash;
//         next();
//     });
// });


// //fetch users detalis(response) and save
// route.use(function (req, res, next) {
//     model.save(req.body, function (err, record) {
//         if (err) {
           
//             next(err);
//         } 
//         else {

//                 //  // performing updation on mendates for stackholder count 
//                 // if(record.mobileUser && record.mobileUser.ismobileUser === true)
//                 // {
//                 //    model.getStackHolderCount(record.mobileUser.mandates.Id,function(err,count){

//                 //         if(err){
                            
//                 //              removeUser(req,res,next,record._id);   
//                 //         }
//                 //         else{
//                 //                 CMSModel.updateStackHolderCount(record.mobileUser.mandates.Id,count,function(err,data){

//                 //                     if(err)
//                 //                     {
//                 //                          removeUser(req,res,next,record._id);
//                 //                     }
//                 //                 });

//                 //          }
//                 //    });


//                 // }
                
                            
//             var data = {
    
//                     "-user-":req.body.name,
//                     "-username-":req.body.email,
//                     "-password-":password
//                     }
//             var mailItem =
//                             {
//                                 email: req.body.email, 
//                                 subject: constant.emailData.REGISTRATION_SUBJECT,
//                                 data: data,
//                                 templateId:config.get('mail.templateId.userRegistration')
//                             };
              
//               emailNotifier.SendGridMailTemplate(mailItem,function(err,data){

//                 if(err){
//                      removeUser(req,res,next,record._id);
//                 }

//                 res.json(response(null,constant.messages.SUCCESSREGESTRATION,constant.statusCodes.SUCCESS));

//               });
            
//         }
//     });

// });