const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const room = new Schema({
    title:{type:String, required:true},
    price:{type:Number, required:true},
    description:{type:String, required:true},
    location:{type:String, required:true},
    unavailability:{ type:Array, default:[], required:false},
    photo:{type:String}
});

const rooms = mongoose.model("roomList",room);
module.exports = rooms;