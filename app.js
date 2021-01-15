var body_parser = require("body-parser"),
    express     = require("express"),
    google      = require('./google'),
    dotenv      = require('dotenv').config(),
    multer      = require('multer'),
    app         = express(),
    fs          = require('fs');


/* CONFIGURATIONS */

// Configure multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {

        cb(null,"blob.wav");

    }
  });

var upload = multer({storage: storage}); // Tells multer where to store our uploads

app.set("view engine","ejs");  // Configure with ejs
app.use("/public", express.static('./public/')); // Configure to use public folder
app.use(body_parser.urlencoded({extended: true})); // Configure to use body parser

/*MORE VARIABLES*/
var recorded = false,
    output   = "default";

/* ROUTES */

app.get("/",function(req,res){

    res.render("landing",{recorded:recorded, output:output});

});

// To store uploads
app.post("/",upload.single('audio'),function(req,res){


    var get_transcript = async () =>{

        var result = await google();
        return result;

    }

    

    get_transcript()
        .then((transcript) => {

            recorded = true;
            output = transcript;
            
            console.log(transcript);
            
            res.render("landing",{recorded:recorded, output:output});

        });


    
    
});

app.listen(process.env.PORT || 1234, process.env.IP || "localhost", function(){

    console.log("[STARTING] Server is starting ...");
    console.log("[LISTENING] Server is listening ...");

});
