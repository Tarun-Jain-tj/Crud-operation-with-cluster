var express = require('express');
var router = express.Router();
var messageController=require('../controller/messageController');
var response=require('../responses/responses');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("get the hit of /users purpose:getting all the messages");
  next();
},messageController.getAllMessages,response.getAllMessage);

/* GET users listing. */
router.post('/', function(req,res,next){
  console.log("post  hit of  /users purpose:save the messages.");
  next();
},messageController.save,response.saveMessage);

module.exports = router;
