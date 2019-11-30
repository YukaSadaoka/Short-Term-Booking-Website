exports.checkAccess = (req, res, next)=>{
    if(req.session.user == null){
        console.log("This is middleware");
       res.redicrect("/user/login");
    }else{
        next();
    }
};

//admin router
exports.checkAdmin = (req,res,next)=>{
    if(res.session.user.admin != true){
        res.redicrect("/dashboard");
    }else{
        next();
    }
};

