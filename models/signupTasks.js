const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const signup = new Schema({
    admin:{type:Boolean, required:true, default: false },
    username:{type:String, required:true },
    email: { type:String, required:true },
    firstname: { type:String, required:true },
    lastname: {type:String, required:true },
    password:{type:String, required:true },
    birthday:{ type:String, required:true },
    datecreated:{ type:Date, default:Date.now()}
});

signup.pre("save", function(next){

   bcrypt.genSalt(10)
   .then(salt=>{
        bcrypt.hash(this.password, salt)
        .then(hash=>{
            this.password=hash;
            next();
        });
   });
})

const signupModel = mongoose.model("Task", signup);
module.exports = signupModel;