const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcryptjs");
const router = express.Router();
const session = require("express-session");
const methods = require("../middlewares/middleware");
const User = require("../models/signupTasks");
const Room = require("../models/rooms");
const Book = require("../models/bookings");

router.use(parser.urlencoded({ extended: false }));
router.use(express.static('public'));
router.use(session({secret:'secret for an encryption'}));

let checkAccess = methods.checkAccess; 
let checkLogin = methods.checkLogin;
let checkUser = methods.checkUser;



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
{   //User dashboard
    if(req.session.userInfo.admin == false){
        Book.find({guestid:req.session.userInfo})
        .then(bookFound=>{

            Room.findOne({_id:bookFound.roomid})
            .then(roomBooked=>{
                console.log(`bookFound:${bookFound}`);
                console.log(`roomBooked:${roomBooked}`);

                res.render("userDashboard",{
                    firstname: req.session.userInfo.firstname,
                    lastname: req.session.userInfo.lastname,
                    bookings: bookFound,
                    room: roomBooked// room id as well to render the link
                }); 
            })
            .catch(err=>{console.log(`${err}`);});
        })
        .catch(err=>{console.log(`error in userdashboard: ${err}`);});

    }else{
    //Admin dashboard
        Book.find({})
        .then(bookings=>{
        console.log(`booking: ${bookings}`)
                res.render("adminDashboard",{
                    firstname: req.session.userInfo.firstname,
                    lastname: req.session.userInfo.lasttname,
                    upcoming: bookings,
                });        
        })
        .catch(err=>{console.log(`error in profile: ${err}`);});
    }
});

router.get("/bookroom/:id",checkAccess,checkUser,(req, res)=>{
    
    Room.findById(req.params.id)
    .then(found=>{
        console.log(`found: ${found}`);
        res.render("booking",{
            room:found
        });
    })
    .catch(err=>{console.log(`error happens in booking: ${err}`);})
});

router.post("/bookroom/:id",(req,res)=>{
    let err = {in:[], out:[], guests:[]};
    let count = 0;

    if(req.body.in == ""){
        err.in.push("Please enter check-in date");
        count++;
    }
    if(req.body.out == ""){
        err.out.push("Please enter check-out date");
        count++;
    }
    if(req.body.guests <= 0){
        err.guests.push("Please select only positive number");
        count++;
    }
    console.log(`session Info: ${req.session.userInfo._id}`);

    if(count > 0){
        res.render("booking",{
            error: err,
            in: req.body.in,
            out: req.body.out            
        })
    }
    else{
        //store booking info 
        Room.findById(req.params.id)
        .then(found=>{
            let name = req.session.userInfo.firstname + " "+ req.session.userInfo.firstname; 

            const bookInfo = {
                checkin:req.body.in,
                checkout:req.body.out,
                guests: req.body.guests,
                guestid: req.session.userInfo._id,
                guestname: name,
                roomid: found._id,
                roomtitle: found.title
            }
            const bookData = new Book(bookInfo);
            
            bookData.save()
            .then(savedBooking=>{

                console.log(`Successfully store book info:${savedBooking}`);
                res.redirect("/user/profile");
            })
            .catch(err=>{console.log(`error in finding room in booking: ${err}`);});
        })
        .catch(err=>{console.log(`error in booking: ${err}`);});

      
    }
});


module.exports=router;