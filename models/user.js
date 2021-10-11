const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    publicKey:{type:String},
    last_auth_timestamp:{type:Date},
    createdAt:{type:Date},
    details:{},
    last_hash:{type:String},
    loggedIn:{type:Boolean}
});

const User = mongoose.model('User',userSchema);
module.exports = User;