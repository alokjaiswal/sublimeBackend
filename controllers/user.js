var User = require("../models/user")
const mongoose = require("mongoose");
const Web3 = require('web3')
let web3 = new Web3('http://ropsten.infura.io/');
web3.setProvider(new Web3.providers.HttpProvider("http://ropsten.infura.io/"));
// var web3;
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(Web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider("http://ropsten.infura.io/"));   
//     if(!web3.isConnected())
//         console.log("not connected");
//     else
//         console.log("connected");
// }


exports.insertAdd = async (req,res)=>{
    try{
        var user = new User({
            publicKey:req.body.publicKey,
            last_auth_timestamp:new Date(),
            createdAt:new Date(),
            details:{},
            last_hash:"",
            loggedIn:false
        })
        await user.save((err,user)=>{
            if(err){
                res.json({
                    isSuccessfull:false,
                    message:`internal server error`,
                    error:err
                })
            }
            else{
                res.json({
                    isSuccessfull:true,
                    message:`user addition successfull`,
                    user:user
                })
            }
        })
    }
    catch(err){
        res.json({
            isSuccessfull:false,
            message:`Internal server error`
        })
    }
}



exports.logout = async (req,res) => {
    try{
        User.findOneAndUpdate({publicKey:req.body.Address},{ $set: {
            last_hash:"",
            loggedIn:false
        }}, { new: true },(err,user)=>{
            if(err){
                res.json({
                    isSuccessfull:false,
                    message:`internal server error but inside find function`,

                })
            }
            else{
                res.json({
                    isSuccessfull:true,
                    message:`logout successfull`,
                    user:user
                })
            }
        });
    }
    catch(err){
        console.log("error ",err)
        res.json({
            isSuccessfull:false,
            message:`Internal server error`,
        })
    }
}

exports.login = async (req,res)=>{
    try{

        var message = req.body.message;
        var hash = req.body.hash;
        var signature = req.body.signature;
        var Address = req.body.Address;
        console.log(message)
        console.log("hash ",hash);
        console.log("signature ",signature)
        console.log("add ",Address)

        // var privateKey =  "a2c386f844dcd73d8b762bbaacca7444a0247b1cdc6c59fdaf15cc153dcc11ed";
        // var a = web3.eth.accounts.sign("hello there", privateKey);

        if(web3.utils.sha3(message) === hash){

            console.log("hash verified");

            var Current_Add = web3.eth.accounts.recover(hash,signature.signature);
            console.log("created a address")
            if(Current_Add === Address){
                console.log("address matched")
                // update user model 
                // send back message, hash
                // QuestionCart.findOneAndUpdate({ questionCartId: req.headers.questioncartid }, { $set: req.body }, { new: true }, function (err, qc) {
                User.findOneAndUpdate({publicKey:Address},{ $set: {
                    last_auth_timestamp:Date.now(),
                    last_hash:message,
                    loggedIn:true
                }}, { new: true },(err,user)=>{
                    if(err){
                        res.json({
                            isSuccessfull:false,
                            message:`internal server error but inside find function`,

                        })
                    }
                    else{
                        res.json({
                            isSuccessfull:true,
                            message:`login successfull`,
                            user:user
                        })
                    }
                });
                
            }
            else{
                res.json({
                    isSuccessfull:false,
                    message:`invalid signature`
                })
            }
        }
        else{
            res.json({
                isSuccessfull:false,
                message:`invalid hash`
            })
        }
    }
    catch(err){
        console.log("error ",err)
        res.json({
            isSuccessfull:false,
            message:`Internal server error`,
        })
    }
}

exports.allUsers = async(req,res)=>{
    try{
        var users = await User.find({})
        
        res.json({
            isSuccessfull:true,
            message:`Returning ${users.length} users`,
            users:users
        })
    }
    catch(err){
        res.json({
            isSuccessfull:false,
            message:`Internal server error`
        })
    }
}

exports.something = async(req,res)=>{
    res.json({
        isSuccessfull:true,
        message:`accessed`
    })
}

exports.isLoggedIn = async (req,res) => {
    try{
        console.log("body",req.body)
        if(req && req.body){
            var user = await User.find({
                publicKey:req.body.publicKey
            })
            if(user.length){

                console.log("time differnce ",Date.now()-user[0].last_auth_timestamp )
                console.log()

                if((Date.now()-user[0].last_auth_timestamp <= 30000) && req.body && req.body.hash && user[0].last_hash!= "" && req.body.hash === user[0].last_hash){

                    // res.json({
                    //     isSuccessfull:true,
                    //     message:"User found in whitelist",
                    //     loggedIn:user[0].loggedIn
                    // })
                    return true;
                }
                else{
                    // res.json({
                    //     isSuccessfull:false,
                    //     message:"login again",
                    //     loggedIn:false
                    // })
                    return false;
                }
            }
            else{
                // res.json({
                //     isSuccessfull:false,
                //     message:"User not found",
                //     user:null
                // })
                return false;
            }
        }
     }
    catch(err){
        // res.json({
        //     isSuccessfull:false,
        //     message:`Internal server error`
        // })
        return false;
    }
}