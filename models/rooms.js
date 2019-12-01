const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const room = new Schema({
    title:{type:String, required:true},
    price:{type:Number, required:true, default:0},
    description:{type:String, required:true},
    location:{type:String, required:true},
    photo:{type:String}
});

const rooms = mongoose.model("roomList",room);
module.exports = rooms;