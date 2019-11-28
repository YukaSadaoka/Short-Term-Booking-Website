const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const session = require("express-session");
const path = require("path");
require("dotenv").config( {path: "./config/vars.env"});


const app = express();

const signupRoutes = require("./routes/Task");

app.use("/signup",signupRoutes);


app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));
app.use(parser.urlencoded({extended: false}));


app.use(session({secret:"secret for an encryption"}))
app.use((req, res,next)=>{
    res.locals.user = req.session.uerInfo;
});

//keys.getMongoURL(),
mongoose.connect(process.env.DATABASE_URL, {userNewUrlParser: true}) 
.then(()=>{
    console.log("Successfully connected to MongoDB");
})
.catch((err)=>{
    console.log(`Something occured: ${err}`);
})



//ALL routers

app.get("/", (req, res)=>{
    res.render("home");
});


app.get("/roomlist", (req,res)=>{
    res.render("roomList");
});



const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`connecting ${PORT}`);
})