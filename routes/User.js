const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcryptjs");
const router = express.Router();
const session = require("express-session");

const methods = require("../middlewares/middleware");
let checkAccess = methods.checkAccess;
let checkAdmin = methods.checkAdmin;
const User = require("../models/signupTasks");

router.use(parser.urlencoded({ extended: false }));
router.use(express.static('public'));


router.get("/login", (req,res)=>{
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
            console.log(`COMPARED IS :${req.body.password}`);
            bcrypt.compare(userData.password, result.password)
            .then(compared=>{
                if(compared == true){
                    console.log(`THIS IS result: ${result}`);
                    console.log(`THIS IS compared: ${compared}`);
                    req.session.userInfo = result;
                    res.redirect("/userdashboard");
                    console.log(`THIS is name: ${req.session.userName}`);
                    
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
                    console.log(`COMPARED IS :${error.password}`);
                }
            })
            .catch(err=>{console.log(`Error occurs during decryption ${err}`)})
        }
    }).catch(err=>{
        console.log(`Error occurs in log in ${err}`);
    });
});

router.get("/logout",(req,res)=>{
    //req.session.destroy();
    res.redirect("/user/login");
});

router.get("/userdashboard/:id", (req,res)=>{

    res.render("userDashboard");
});

router.get("/admindashboard/:id", (req,res)=>{

    res.render("adminDashboard");
});

module.exports=router;