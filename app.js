var express = require("express"),
    app     = express();

// Configure with ejs
app.set("view engine","ejs");

app.get("/",function(req,res){

    res.render("landing");

});

app.listen(1234,"localhost",function(){

    console.log("[STARTING] Server is starting ...");
    console.log("[LISTENING] Server is listening ...");

});

