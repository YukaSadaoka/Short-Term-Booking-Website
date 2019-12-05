const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booking = new Schema({
    checkin:{type:String, required:true},
    checkout:{type:String, required:true},
    guests:{type:String, required:true},
    guestid:{type:String, required:true},
    guestname:{type:String, require:true},
    roomid:{type:String,required:true},
    roomtitle:{type:String, required:true},
    roompic:{type:String},
    dateBooked:{ type:Date, default: Date.now()}
});

const bookings = mongoose.model("book",booking);
module.exports = bookings;