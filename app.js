const express = require("express");
const exphbs = require("express-handlebars");
const parser = require("body-parser"); 

let app = express()

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));
app.use(parser.urlencoded({extended: false}));

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/registration", (req, res)=>{
    res.render("registration");
});

app.post("/registration", (req,res)=>{

    let errMessage = [];

    const user = req.body.username;
    const userReg1 = /^[A-Z][A-Za-z0-9!$#@_]{1,}/;
    const userReg2 = /.*[0-9].*/;
    
    if(user==""){
        errMessage.push("Please enter username");
    }else if(!(userReg1.test(user)) || !(userReg2.test(user))){
        errMessage.push("Username must start with uppercase letter, contain at least one number and can contain symbol(! $ # @ _)");
    }

    if(req.body.email==""){
        errMessage.push("Please enter email");
    }
    
    if(req.body.firstname==""){
        errMessage.push("Please enter first name");
    }

    if(req.body.lastname==""){
        errMessage.push("Please enter last name");
    }

    const password = req.body.password;
    const reg1 = /^[A-Za-z0-9!$#@_]{8,}/; 
    const reg2 = /.*[A-Z].*/;
    const reg3 = /.*[!$#@_].*/;

    if(password==""){
        errMessage.push("please enter Password");
    }else if(!(reg1.test(password))|| !(reg2.test(password)) || !(reg3.test(password))){
        
        errMessage.push("Password must be longer than 8 characters, contain at least one symbol(! $ # @ _) and one uppercase character");
    }
  
    if(errMessage.length > 0){
    
        res.render("registration",{
            error:errMessage
        });
    }

});

app.get("/roomlist", (req,res)=>{
    res.render("roomList");
});

app.get("/login", (req,res)=>{
    res.render("login");
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