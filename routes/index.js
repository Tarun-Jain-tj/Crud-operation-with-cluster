/*
	OBJECTIVE: BASIC CRUD OPERATIONS FOR NODE-WITH-EXPRESS
*/

var express = require('express');
var router = express.Router();
var messageController=require('../controller/messageController');
var response=require('../responses/responses');

/* GET data. */
router.get('/',test,messageController.getAllMessages,response.getAllMessage);

function test (req, res, next) {
  req.tarun ="hello";
 console.log("get  hit of  /crud purpose:get all the messages.\n");
  next();
}

/*POST data*/
router.post('/',function(req,res,next){
  console.log("post  hit of  /crud purpose:save the messages.\n",req.body);
  next();
},messageController.save,response.saveMessage);

/*PUT data*/
router.put('/', function(req, res, next) {
  console.log("put  hit of  /crud purpose:save the messages.\n",req.body);
  next();
},messageController.update,response.updateMessage);


/*Delete data*/
router.delete('/', function(req, res, next) {
  console.log("delete hit of /crud purpose:remove the messages.\n",req.body);
  next();
},messageController.remove,response.removeMessage);


module.exports = router;
