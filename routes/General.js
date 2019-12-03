const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const parser = require("body-parser");
const Room = require("../models/rooms");

router.use(parser.urlencoded({extended:false}));
router.use(express.static('public'));


router.get("/search", (req,res)=>{  
    res.render("roomList");
});

router.post("/search",(req,res)=>{
    console.log(`request is: ${req.body.choice}`);

    Room.find({location:req.body.choice})
    .then((foundRooms)=>{

    //console.log(`${foundRooms}`);
        res.render("roomList",{
            lists:foundRooms                    
        });

    }).catch(err=>{console.log(`Error: ${err}`);});

  
});



module.exports=router;