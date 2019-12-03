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