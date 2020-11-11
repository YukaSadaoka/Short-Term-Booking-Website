const multer  = require('multer')
const upload = multer()

exports.checkAccess = (req, res, next)=>{
    if (req.session.userInfo == null) {
        res.redirect("/user/login");
    } else {
    next();
    }
};


exports.checkLogin = (req,res,next)=>{  
    if(req.session.userInfo != null){
        res.redirect("/user/profile");
    }else{
        next();
    }
};


exports.checkAdmin = (req,res,next)=>{  
    if(req.session.userInfo.admin == false){
        res.redirect("/user/profile");
    }else{
        next();
    }
};

exports.checkUser = (req,res,next)=>{  
    if(req.session.userInfo.admin == true){
        res.redirect("/user/profile");
    }else{
        next();
    }
};

exports.checkCriteria = (req,res,next)=>{

    let error = { location:[], checkIn:[], checkOut:[], guest:[] };

    const roomCriteria = {
        location: req.body.location,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        guest: req.body.guest
    };
    
    
    console.log("\ncheckout " + req.body.checkOut);
    console.log("\nlocation " + req.body.location);
    console.log("\ntype " + typeof req.body.checkOut);

    error.location.push(typeof roomCriteria.location == "undefined" ? "Please select a location": "");
    error.checkIn.push(typeof roomCriteria.checkIn == "undefined" ? "Please select check in date": "");
    error.checkOut.push(typeof roomCriteria.checkOut == "undefined" ? "Please select check out date": "");
    error.guest.push(typeof roomCriteria.guest == "undefined" ? "Please select the number of guest": "");
    
    console.log("location " + error.location.length);

    if (error.location.length != 0 || error.checkIn.length != 0  || error.checkOut.length != 0  || error.guest.length != 0  ){
        res.render("home",
        {
            criteria: roomCriteria,
            err:error
        });
    }else{
        next();
    }
    console.log("passing middleware");
};

function checkDate(){


}