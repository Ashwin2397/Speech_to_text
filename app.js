var body_parser = require("body-parser"),
    express     = require("express"),
    dotenv   = require('dotenv').config(), 
    google      = require('./google'),
    multer      = require('multer'),
    cors        = require('cors'), // Cross origin request support to allow axios
    app         = express(),
    fs          = require('fs');


    
/* CONFIGURATIONS */

// Enable cors
app.use(cors())

// Configure multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, `${__dirname}/public/uploads/`);
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

// Where outputs are the data transribed by the speech to text enginess
var microsoft_output   = "",
    google_output      = "";

/* ROUTES */

app.get("/",function(req,res){

    res.render("landing");

});

app.get("/engine/microsoft",function(req,res){

    res.render("engine/microsoft",{output:microsoft_output});

});

app.get("/engine/google",function(req,res){

    res.render("engine/google",{output:google_output});

});

// To store uploads
app.post("/",upload.single('audio'),function(req,res){


    var get_transcript = async () =>{

        var result = await google();
        return result;

    }

    get_transcript()
        .then((transcript) => {

            if(req.body.engine == "/engine/google"){

                google_output = transcript;
            }else{
                microsoft_output = transcript;
            }
            
            console.log(transcript);
            

            res.redirect("/");
        })
        

    
    
});

app.listen(process.env.PORT, function(){

    console.log("[STARTING] Server is starting ...");
    console.log(`[LISTENING] Server is listening ...`);


});
