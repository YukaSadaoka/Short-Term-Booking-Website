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
let checkAccess = methods.checkAccess; 
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
                if(compared == true){
                   
                    req.session.userInfo = result;
                    res.redirect("/user/profile");
                    
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