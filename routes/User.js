const express = require("express");
const parser = require("body-parser");
const bcrypt = require('bcryptjs');
const router = express.Router();


router.use(parser.urlencoded({ extended: false }));
router.use(express.static('public'));


app.get("/login", (req,res)=>{
    res.render("login");
});



app.post("/login", (req,res)=>{

    let error = [];

    if(req.body.email==""){
        error.push("Please enter email");
    }

    if(req.body.password==""){
        error.push("Please enter password");
    }

    if(error.length > 0){
        res.render("login",
        {
            message:error
        });
    }

});