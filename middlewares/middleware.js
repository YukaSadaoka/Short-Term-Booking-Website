exports.checkAccess = (req, res, next)=>{
    /*if(res.locals.user == undefined){
        console.log(` This is session info inside middleware.js: ${res.locals.user}`)
        res.redirect("/user/login");
    }else{
        next();
    }*/  
    if (req.session.userInfo == null) {
       // console.log(` This is session info inside middleware.js: ${res.locals.user}`)
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

