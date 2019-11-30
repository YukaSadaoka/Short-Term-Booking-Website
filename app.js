const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 
const mongoose = require("mongoose");
//const fileupload = require("express-fileupload");
const session = require("express-session");
const path = require("path");
require("dotenv").config( {path: "./config/vars.env"});

const app = express();

//body-parser
app.use(parser.urlencoded({extended: false})); 
//file-upload
//method_overide
//session
app.use(session({
    secret:'secret for an encryption', // this is the key to encrypt
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next)=>{
   // console.log(`Session Info in app.js: ${req.session.userInfo}`);
    res.locals.userInfo = req.session.userInfo; 
    //it has to keep the same name, because it is going to pass from req to res
    //on every request to the server
   // console.log(`Global seesion Info in app.js: ${res.locals.user}`);
    next();
});
//routes
const signupRoutes = require("./routes/Task"); // is this the register? yes
// ok, so this route is not protected. .. and you dont have access to the user info here
// there is one problem because i thought i needed to redirect user after registration to dashboard that is protected now
//but if i don't need to direct there, i think this's solved
//you can do it by creating a session at the end and then redirect the user to the dashboard
// i'll show
const userRoutes = require("./routes/User");// this is for log in

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static('public'));

app.use("/signup",signupRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/roomlist", (req,res)=>{
    res.render("roomList");
});

//keys.getMongoURL(),
mongoose.connect(process.env.DATABASE_URL, {userNewUrlParser: true}) 
.then(()=>{
    console.log("Successfully connected to MongoDB");
})
.catch((err)=>{
    console.log(`Something occured: ${err}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`connecting ${PORT}`);
});