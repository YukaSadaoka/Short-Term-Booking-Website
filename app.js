const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 
const mongoose = require("mongoose");
//const fileupload = require("express-fileupload");
const session = require("express-session");
const path = require("path");
require("dotenv").config( {path: "./config/vars.env"});

const app = express();

const signupRoutes = require("./routes/Task");
const userRoutes = require("./routes/User");

app.use("/signup",signupRoutes);
app.use("/user", userRoutes);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(parser.urlencoded({extended: false}));

app.use(express.static('public'));

app.use(session({secret:'secret for an encryption', resave: true, saveUninitialized: true}));

app.use((req, res, next)=>{
    console.log(`Session Info: ${req.session.userInfo}`);
    res.locals.user = req.session.userInfo;
    next();
});





//keys.getMongoURL(),
mongoose.connect(process.env.DATABASE_URL, {userNewUrlParser: true}) 
.then(()=>{
    console.log("Successfully connected to MongoDB");
})
.catch((err)=>{
    console.log(`Something occured: ${err}`);
})

app.get("/", (req, res)=>{
    res.render("home");
});


app.get("/roomlist", (req,res)=>{
    res.render("roomList");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`connecting ${PORT}`);
})