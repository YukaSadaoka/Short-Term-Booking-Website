const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const session = require("express-session");
const helpers = require('handlebars-helpers');
const equal = helpers.comparison();

const helperFunc = require("./routes/Helper");
const Room = require("./models/rooms");
const Booking = require("./models/bookings");


require("dotenv").config( {path: "./config/vars.env"});
const app = express();


app.use(parser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(fileupload());
app.use(session({
    secret:'secret for an encryption', // this is the key to encrypt
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next)=>{
    res.locals.userInfo = req.session.userInfo;
    next();
});

const signupRoutes = require("./routes/RegistrationTask");
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Administrator");
const contentsRoutes = require("./routes/RoomList");
// const { checkout } = require("./routes/User");
// const { makeDateObj } = require("./routes/Helper");


app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");


app.use("/signup",signupRoutes);
app.use("/user", userRoutes);
app.use("/admin",adminRoutes);
app.use("/contents", contentsRoutes);

app.get("/", (req, res)=>{
    res.render("home");
});

app.post("/", (req,res)=>{

    const roomCriteria = { location: req.body.location, checkIn: req.body.checkIn, checkOut: req.body.checkOut, guest: req.body.guest };
    let validationResult = helperFunc.validateHomeSearchUserInput(roomCriteria);

    if (validationResult != null){
        console.log("need to get more user input " + validationResult);
        res.render("home", {criteria: roomCriteria, err:validationResult});
    }else{
        let roomToDisplay = [];
        Room.find({location:roomCriteria.location})
        .exec((error, foundRooms)=>{
            foundRooms.forEach(room =>{
                room.unavailability.sort();
                
                let checkIn = helperFunc.makeDateObj(roomCriteria.checkIn);
                let checkOut = helperFunc.makeDateObj(roomCriteria.checkOut);
                foundCheckIn = room.unavailability.find(date => date == checkIn);
                foundCheckOut = room.unavailability.find(date => date == checkOut);
                if (foundCheckIn == undefined && foundCheckOut == undefined){
                    roomToDisplay.push(room);
                }
            });
            if(roomToDisplay.length != 0){
                res.render("roomList",{ lists:roomToDisplay, location: roomCriteria.location });
            }else{
                res.render("roomList",{ error:"Sorry there is no match for your search...", location: roomCriteria.location });
            }
        })
    }
});


//keys.getMongoURL(),
mongoose.connect(process.env.DATABASE_URL, {userNewUrlParser: true})
.then(()=>{
    console.log("Successfully connected to MongoDB\n");
})
.catch((err)=>{
    console.log(`Something occured: ${err}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`connecting ${PORT}`);
});