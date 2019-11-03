const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 
const mongoose = require("mongoose");


const app = express();

const signupRoutes = require("./routes/Task");

app.use("/signup",signupRoutes);


app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));
app.use(parser.urlencoded({extended: false}));




URL = 'mongodb+srv://yuka-sadaoka:yukaweb322A3@cluster0-xl7li.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(URL, {userNewUrlParser: true}) 
.then(()=>{
    console.log("Successfully connected to MongoDB");
})
.catch((err)=>{
    console.log('Something occured: ${err}');
})



//ALL routers

app.get("/", (req, res)=>{
    res.render("home");
});


app.get("/roomlist", (req,res)=>{
    res.render("roomList");
});

app.get("/login", (req,res)=>{
    res.render("login");
});


app.get("/dashboard",(req,res)=>{

    res.render("userDashboard");
});


app.post("/login", (req,res)=>{

    let error = [];

    if(req.body.email==""){
        error.push("Please enter email");
    }

    if(req.body.password==""){
        error.push("Please enter password");
    }

    if(error.length > 0){
        res.render("login",
        {
            message:error
        });
    }

});

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log("connecting");
})