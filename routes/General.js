const express = require("express");
const router = express.Router();
const parser = require("body-parser");
const Room = require("../models/rooms");

router.use(parser.urlencoded({extended:false}));
router.use(express.static('public'));

router.get("/search", (req,res)=>{  
    res.render("roomList");
});

router.post("/search",(req,res)=>{
    Room.find({location:req.body.choice})
    .then((foundRooms)=>{
         if(foundRooms != ""){
           
            if(foundRooms.length > 6){
                let temp = [];
                for(let i = 0; i < foundRooms.length-1; i++){
                    console.log(`inside loop${temp}`)
                    temp.push(foundRooms[i]);
                }
              
                res.render("roomList",{
                    lists:temp,
                    location: req.body.choice
                });
            }
            else{
               // console.log(`foundRoom in if:${foundRooms}`);
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