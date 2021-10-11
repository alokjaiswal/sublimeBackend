const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
var mongoose = require("mongoose")
var dotenv = require("dotenv");
var userController = require('./controllers/user');

var app = express();
var httpServer = http.createServer(app);
var port = 1234;
dotenv.config();
var user = require("./routes/user");
var mongoDBURI = process.env.MONGO_DEV_URI;
try{
    console.log("url ",mongoDBURI)
    mongoose.connect(mongoDBURI);
}
catch(err){
    console.log("error while connecting to moongodb")
}

app.use(bodyParser.json({ extended: true, limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(async(req,res,next)=>{
    //run isLoggedin function
    
    console.log("in middleware ",req.url)
    if(req.url != "/user/login"){
        var flag = await userController.isLoggedIn(req,res);
        if(flag){
            next();
        }
        else{
            res.json({
                isSuccessfull:false,
                message:`user should login again`
            })
        }
    }
    else{
        next();
    }
    //else send login request
})

app.use('/user',user);






httpServer.listen(port,()=>{
    console.log("server started at port ",port)
});