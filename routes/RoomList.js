const express = require("express");
const router = express.Router();
const parser = require("body-parser");
const Room = require("../models/rooms");
const { route } = require("./User");
const methods = require("../middlewares/middleware");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

let checkCriteriaBefore = methods.checkCriteria;

router.use(parser.urlencoded({extended:false}));
router.use(express.static('public'));

router.get("/search", (req,res)=>{  
    res.render("roomList");
});

router.post("/searchByCity", (req,res)=>{
    Room.find({location:req.body.choice})
    .then((foundRooms)=>{
         if(foundRooms != ""){
            if(foundRooms.length > 6){
                let roomList = [];
                for(let i = 0; i < foundRooms.length-1; i++){
                    roomList.push(foundRooms[i]);
                }
                res.render("roomList",{
                    lists:roomList,
                    location: req.body.choice
                });
            }
            else{
                res.render("roomList",{
                    lists:foundRooms,
                    location: req.body.choice
                });
            }
        }else{
            res.render("roomList",{
                error: 'Sorry No Room Found in This Location. Please Select a Different Location.'
            });
        }
    }).catch(err=>{console.log(`Error: ${err}`);});  
    
});


module.exports=router;