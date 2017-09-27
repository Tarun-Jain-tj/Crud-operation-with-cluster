var response={};

//create
response.saveMessage=function(req,res,next){
    res.json(res.result);
};

//read
response.getAllMessage=function(req,res,next){
    res.json(res.result);
};

//update
response.updateMessage=function(req,res,next){
    res.json(res.result);
};

//delete 
response.removeMessage=function(req,res,next){
    res.json(res.result);
};

module.exports=response;
