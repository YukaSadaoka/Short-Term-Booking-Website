let express = require("express")
let exphbs = require("express-handlebars")
let app = express()

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static('public'));

app.get("/", (req, res)=>{
    res.render("home");
})
app.get("/registration", (req, res)=>{
    res.render("registration");
})
app.get("/roomlist", (req,res)=>{
    res.render("roomList");
})


let PORT = 3000
app.listen(PORT,()=>{
    console.log("connecting");
})