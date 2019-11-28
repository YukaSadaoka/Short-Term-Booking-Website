const express = require("express");
const parser = require("body-parser");
const bcrypt = require('bcryptjs');
const router = express.Router();
const Task = require("../models/signupTasks");


router.use(parser.urlencoded({ extended: false }));
router.use(express.static('public'));



// the route /signup/registration
router.get("/registration", (req, res)=>{

    //Handlebars route
    res.render("registration");
});

router.post("/registration", (req,res)=>
{
    let err = {username: [], email: [], firstname:[],lastname: [],password:[], birthday:[]};
    let counter = 0;
    
    const user = req.body.username;
    const userReg1 = /^[A-Z][A-Za-z0-9!$#@_]{1,}/;
    const userReg2 = /.*[0-9].*/;
    //console.log(`return?? : ${result}`);

     if(user==""){
        err.username.push("Please enter username");
        counter++;
    }else if(!(userReg1.test(user)) || !(userReg2.test(user))){
        err.username.push("Username must start with uppercase letter, contain at least one number and can contain symbol(! $ # @ _)");
        counter++;
    }
        
    
    if(req.body.email==""){
        err.email.push("Please enter email");
        counter++;
    }

    if(req.body.firstname==""){
        err.firstname.push("Please enter first name");
        counter++;
    }

    if(req.body.lastname==""){
        err.lastname.push("Please enter last name");
        counter++;
    }

    const password1 = req.body.password1;
    const password2 = req.body.password2;
    const reg1 = /^[A-Za-z0-9!$#@_]{8,}/;
    const reg2 = /.*[A-Z].*/;
    const reg3 = /.*[!$#@_].*/;

    if(password1 == "" || password2 == ""){
        err.password.push("Please enter password");
        counter++;
    }else if(!(reg1.test(password1))|| !(reg2.test(password1)) || !(reg3.test(password1))){
        err.password.push("Password must be longer than 8 characters, contain at least one symbol(! $ # @ _) and one uppercase character");
        counter++;
    }else if(password1 !== password2){
        err.password.push("Password must match");
        counter++;
    }

    if(req.body.bday==""){
        err.birthday.push("Please enter birthday");
        counter++;
    }

    if(counter > 0){
        Task.findOne({username:req.body.username})
        .then(result =>{
            console.log(`ERROR res: ${result}`);
            //console.log(`ERROR res: ${err.username}`);

            if(result != null){
                err.username.push("This Username already exists!");
            }
            res.render("registration",{
                err: err,
                username: req.body.username,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password1,
                birthday: req.body.bday
            });     
        })
        .catch(err=>{
            console.log(`counter is ${err}`);
        });
    }
    else{
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hash(req.body.password1, salt);
        console.log(hash);

        const newUser =
        {
            username: req.body.username,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hash,
            birthday: req.body.bday
        }

        const nodemailer = require("nodemailer");
        const sgTransport = require("nodemailer-sendgrid-transport");

        const options = {
            auth:{
                api_key: process.env.SENDGRID_API
            }
        }

        const mailer = nodemailer.createTransport(sgTransport(options));

        const email = {
            to: req.body.email,
            from: process.env.MYEMAIL,
            subject: 'Welcome to PerfectRoom',
            text: 'Hi ' + req.body.firstname + '! Welcome to PerfectRoom!' + '<br>' + 'Your information has been registered in our system'
            + '<br>' + 'Your username: ' + req.body.username  + '<br>',
            html: 'Hi ' + req.body.firstname + '! Welcome to PerfectRoom!' + '<br>' + 'Your information has been registered in our system'
            + '<br>' + 'Your username: ' + req.body.username  + '<br>',
        };

       
        mailer.sendMail(email, (err,res)=>{
            if(err){
                console.log("Error ocurrs while sending email: ${err}");
            }
            console.log(res);
        });


        const userSignup = new Task(newUser);

        userSignup.save()
        .then(()=>{
            console.log("User information was added to the database");
            res.redirect("/signup/dashboard");

        })
        .catch(err=>console.log("Error: "+ err));
    }
});

router.get("/dashboard",(req,res)=>{

    res.render("userDashboard");
});



module.exports=router;