const express = require("express");
const parser = require("body-parser");
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
   
    console.log('Test: '+ req.body.bdayDay);

    const err = { 
        username: []
    };

    const newUser =
    {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        birthday: req.body.bday
    }

    console.log('New USER: ', newUser);


    let errMessage = [];

    const user = req.body.username;
    const userReg1 = /^[A-Z][A-Za-z0-9!$#@_]{1,}/;
    const userReg2 = /.*[0-9].*/;

    if(user==""){
        err.username.push("Please enter username");
    }else if(!(userReg1.test(user)) || !(userReg2.test(user))){
        err.username.push("Username must start with uppercase letter, contain at least one number and can contain symbol(! $ # @ _)");
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
        errMessage.push("Please enter password");
    }else if(!(reg1.test(password))|| !(reg2.test(password)) || !(reg3.test(password))){

        errMessage.push("Password must be longer than 8 characters, contain at least one symbol(! $ # @ _) and one uppercase character");
    }

    if(req.body.bday==""){
        errMessage.push("Please enter birthday");
    }


    if(errMessage.length > 0){

        //Views/registration
        res.render("registration",{
          error:errMessage,

        });
    }
    else{


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