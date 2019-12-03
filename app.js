const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const session = require("express-session");
const path = require("path");
require("dotenv").config( {path: "./config/vars.env"});
const app = express();

//body-parser -> file-upload -> method_overide -> session
app.use(parser.urlencoded({extended: false})); 
app.use(fileupload());
app.use(session({
    secret:'secret for an encryption', // this is the key to encrypt
    resave: false,
    saveUninitialized: false,
}));
app.use((req, res, next)=>{
   // console.log(`Session Info in app.js: ${req.session.userInfo}`);
    res.locals.userInfo = req.session.userInfo; 
    next();
});

const signupRoutes = require("./routes/Task"); 
const userRoutes = require("./routes/User");
const adminRoutes = require("./routes/Administrator");
const generalRoutes = require("./routes/General");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static('public'));

app.use("/signup",signupRoutes);
app.use("/user", userRoutes);
app.use("/admin",adminRoutes);
app.use("/contents", generalRoutes);
app.get("/", (req, res)=>{
    res.render("home");
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