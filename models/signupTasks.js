const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signup = new Schema({
    username:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true
    },
    firstname:
    {
        type:String,
        required:true
    },
    lastname:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    birthday:
    {
        type:String,
        required:true
    },
    datecreated:
    {
        type:Date,
        default:Date.now()
    }

});

const signupModel = mongoose.model("Task", signup);
module.exports = signupModel;