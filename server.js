// Required modules
const express = require("express"),
      session = require("express-session"),
      bodyParser = require("body-parser"),
      multer = require('multer'),
      multerS3 = require('multer-s3'),
      fs = require('fs'),
      http = require("http"),
      AWS = require('aws-sdk');
      app = express();
      
app.use(express.static("client",{extensions:['html']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import DB methods for insert and select
const {insertIntoUsers, selectFromUsersByLogin, insertIntoShares} = require("./db/database.js");

AWS.config.update({region: "us-east-1"})

var s3 = new AWS.S3({
   accessKeyId: "ASIAU2XBVV2JJM3T3JWN",
   secretAccessKey: "qflZWNluoENoBPdgIBLyUj7PBbOWVZ5axywg4Tyo",
   Bucket:"uab-cs633-weglass-fileshare-bucket",
   sessionToken: `FwoGZXIvYXdzEI7//////////wEaDNAthPOtIgQZPkTuRiK+AWjKXwNGcsbN6VMg0esAyd9lFQvQDK9+mMPv3dQlaA8nS2hEwd81IIkTe06aRVQjZ9WKDkFVO3ksoDRbXjuQwzeMlcVjt33OtvoAGBE651xPE6qLnJzbqPg2lSdGZ1B7INqlNLIqaFUxvt+6eR09KWRTpGt7ALsEsVHpTB2lKEgBSc0mmUs4podZRX1+ss9IZO1RDUomLvZFaeAl5jsPuP37c5l9uxcpP+Tg1hTonzRgBBu5n8c33g2zNyqGRHkoxoTBiAYyLV2toL5ypJvvkpeymNfbKkcHMiCbZPlZd5FvGpe//IMgQJKuX4mwbbU1L9sezQ==`
})
var upload = multer({
   storage: multerS3({
       s3: s3,
       bucket:"uab-cs633-weglass-fileshare-bucket",
       metadata: function (req, file, cb) {
           cb(null, { fieldName: file.fieldname });
       },
       key: function (req, file, cb) {
           cb(null, Date.now().toString())
       }
   })
})


// Configure application security
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const allowedPaths = ['/login','/signup'];
app.use((req,res,next) => {
  try {
    const path = req.originalUrl;
    if (req.session.loggedin
    || Array.from(allowedPaths).some((allowed) => path.includes(allowed))
    ) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.redirect("/login");
  }
});

// Security Routes
app.post("/api/login", (req, res) => {
  const login = {
    email:req.body.username,
    password:req.body.password
  }
  
  selectFromUsersByLogin(login, (err,rows) => {
    if (err || !rows || rows.length == 0) {
      res.sendStatus(401);
    } else {
      req.session.loggedin = true;
      req.session.username = rows[0].email;
      res.sendStatus(200);
    }
  });
});

app.get("/api/logout", (req, res) => {
  req.session.loggedin = false;
  req.session.username = undefined;
  res.redirect("/login");
})

app.post("/api/signup", (req,res) => {
  try {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
      throw new Error();
    }
    const user = {
      firstName:req.body.firstname, 
      lastName:req.body.lastname, 
      email:req.body.email,
      password:req.body.password
    }
    insertIntoUsers(user, (err, rows) => {
      if (err || !rows) {
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    })
  } catch (error) {
    console.error(error)
    res.sendStatus(500);
  }
})
  
// Client Routes
app.get("/", (req,res) => res.redirect("/login"))

app.post('/api/upload', upload.single('sharefile'), (req, res) => {
  
  try{
    console.log("fileUploaded!");
    console.log(JSON.stringify(req.file));
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
  /*const source = req.file.path, 
        targetName = req.file.filename;

  fs.readFile(source, (err, filedata) => {
      if (!err) {
        const putParams = {
            Bucket      : 'uab-cs633-weglass-fileshare-bucket',
            Key         : targetName,
            Body        : filedata
        };
        s3.putObject(putParams, (err, data) => {
          if (err) {
            console.log('Could nor upload the file. Error :',err);
            return res.send({success:false});
          } 
          else{
            fs.unlink(source);
            console.log('Successfully uploaded the file');
            
            //Send Text Messages
            /*
            const s3Link = data.Location;
            Array.from(req.body.phone).forEach(number => 
              new AWS.SNS({apiVersion: '2010-03-31'})
              .publish({
                Message: 'TEXT_MESSAGE', 
                PhoneNumber: '+1' + number,
              }).promise()
              .then((data) => console.log("MessageID is " + data.MessageId))
              .catch((err) => console.error(err, err.stack))
            );
            
            
          }
        });
      }
      else{
        console.log({'err':err});
      }
    });*/
})

http.createServer(app).listen(3000)
console.log("Server Started listening on port: 3000")