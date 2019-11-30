const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcryptjs");
const router = express.Router();
const session = require("express-session");
const methods = require("../middlewares/middleware");
const User = require("../models/signupTasks");

router.use(parser.urlencoded({ extended: false }));
router.use(express.static('public'));
router.use(session({secret:'secret for an encryption'}));
//DO we need to add the user(session....) everwhere i wanan use session?
// i thougth i only needed to include this once in app.js
//session is divided in setup and using it... here is the setup
// without this setup in all files where i need to use setups, my app doesn't work
//but is it supposed to have this setup once or multiple?
// setup is just once
let checkAccess = methods.checkAccess; // this is the middleware to avoid code repetition, this is using the session
let checkLogin = methods.checkLogin;



router.get("/login", checkLogin, (req,res)=>{
    res.render("login");
});

router.post("/login", (req,res)=>{

    let error = { email:[], password:[] };

    const userData = {
        email: req.body.email,
        password: req.body.password
    }
    if(userData.email == ""){error.email.push("Please enter email.");} 
    if(userData.password == ""){error.password.push("Please enter password.");}
  
    User.findOne({email:userData.email})
    .then(result=>{
        
        if(result == null){
            if(result == null){ error.email.push("Email is not found. Please enter your email again.");}
            res.render("login",
            {   email:req.body.email,
                password:req.body.password,
                err:error
            });
            
        }else{       
            bcrypt.compare(userData.password, result.password)
            .then(compared=>{

                console.log(`THIS IS result: ${result}`);
                console.log(`THIS IS compared: ${compared}`);
                if(compared == true){
                   
                    req.session.userInfo = result;
                    res.redirect("/user/profile");
                    console.log(`THIS is name: ${req.session.userInfo}`);
                    
                }else{
                    if(userData.password != ""){
                        error.password.push("Password is not found!");
                    }                    
                    res.render("login",
                    {
                        email:req.body.email,
                        password:req.body.password,
                        err:error
                    });
                }
            })
            .catch(err=>{console.log(`Error occurs during decryption ${err}`)})
        }
    }).catch(err=>{
        console.log(`Error occurs in log in ${err}`);
    });
});

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/user/login");
});
//I have one more question about the URL 
// if user logs in successfully, is the URL including their ID??
// no, it will create a cookie with their credentials (encrypted with the key that you provided)
router.get("/profile",checkAccess,(req,res)=>
{   
    if(req.session.userInfo.admin == false){
        res.render("userDashboard",{
            firstname: req.session.userInfo.firstname,
            lastname: req.session.userInfo.lastname,
        });
    }else{
        res.render("adminDashboard",{
            firstname: req.session.userInfo.firstname,
            lastname: req.session.userInfo.lasttname,
        });
    }
});


module.exports=router;