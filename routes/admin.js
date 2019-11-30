const express = require("express");
const router = express.Router();
const parser = require("body-parser");

router.use(parser.urlencoded({extended:false}));
router.use(express.static('public'));

router.get("/managerooms", (req,res)=>{
    res.render("manageRooms");
});

router.get("/editrooms",(req,res)=>{
    res.render("editRooms");
});

router.get("/addrooms",(req,res)=>{
    res.render("addRooms");
});