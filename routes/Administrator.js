const express = require("express");
const router = express.Router();
const parser = require("body-parser");
const methodOverride = require("method-override");
const Room = require("../models/rooms.js");

router.use(parser.urlencoded({extended:false}));
router.use(express.static('public'));
router.use(methodOverride('_method'));

router.get("/managerooms", (req,res)=>{
    
    Room.find()
    .then(roomFound =>{
        res.render("manageRooms",{
            lists:roomFound
        });
    })
    .catch(err=>{console.log(`Can't find rooms in database: ${err}`)});
});

router.get("/addrooms", (req,res)=>{
    
    res.render("addRooms");
});

router.post("/addrooms",(req,res)=>{

    let err = {title:[], price:[], description:[], location:[], file:[]};
    let count = 0;

    if(req.body.title == ""){
        err.title.push("Please enter a title");
        count++;
    }
   
    if(req.body.price == ""){
        err.price.push("Please enter price");
       count++;
    }
    if(req.body.description == ""){
        err.description.push("Please enter description");
        count++;    
    }
    if(req.body.location == ""){
        err.location.push("Please provide a location");
        count++;
    }
    if(req.files == null){
        err.file.push("Please upload an image");
        count++;
    }else if(req.files.photo.mimetype.indexOf("image") == -1){
        err.file.push("You can only upload images as jpg, gif, png formats");
        count++;
    }

    if(count > 0){   
        res.render("addRooms",{
            error:err,
            title:req.body.titel,
            price:req.body.price,
            description:req.body.description,
            location: req.body.location
        });
    }else{
        const validRoom = {
            title:req.body.title,
            price:req.body.price,
            description:req.body.description,
            location: req.body.location
        }
        
        const room = new Room(validRoom);
        room.save()
        .then(savedRoom =>{
            req.files.photo.name = `pic_${savedRoom._id}.ext`

            console.log(`validRoom is: ${req.files.photo.name }`);
            req.files.photo.mv(`public/userPics/${req.files.photo.name}`)
            .then(()=>{
                console.log(`room is added to database: ${savedRoom}`);
                res.redirect("/admin/managerooms");
            });           
        })
        .catch(err=>{console.log(`Error in save() in admin.js: ${err}`);});
    }
});

router.get("/editrooms/:id",(req,res)=>{

    Room.findById(req.params.id)
    .then((roomNow)=>{
        console.log(`room Found is ${roomNow}`);
        res.render("editRooms",{
            _id:roomNow._id,
            title:roomNow.title,
            price:roomNow.price,
            description:roomNow.description,
            location: roomNow.location
        });
    }).catch(err=>{console.log(`error to find a room: ${err}`); })
});

router.put("/editrooms/:id",(req,res)=>{
    
    Room.findById(req.params.id)
    .then((roomFound)=>{
        roomFound.title = req.body.title;
        roomFound.price = req.body.price;
        roomFound.description = req.body.description;
        roomFound.location = req.body.location;

        roomFound.save()
        .then(updatedRoom=>{
            res.redirect("/admin/managerooms");
        })
        .catch(err=>{console.log(`err to update room:${err}`);});
    }).catch(err=>{
        console.log(`${err}`)
        res.redirect("/admin/managerooms");
    });

})




module.exports=router;