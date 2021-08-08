// Required modules
const express = require("express"),
      session = require("express-session"),
      bodyParser = require("body-parser"),
      multer = require('multer'),
      fs = require('fs'),
      http = require("http"),
      AWS = require('aws-sdk');
      app = express();
      
app.use(express.static("client",{extensions:['html']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import DB methods for insert and select
const {insertIntoUsers, selectFromUsersByLogin, insertIntoShares} = require("./db/database.js");

//Configure multer with the local tmp directory for uploads
const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

//Configure AWS credentials
AWS.config.update({
  accessKeyId: "ASIAU2XBVV2JHZFBLO5N", // Access key ID
  secretAccesskey: "pVfoeZfJrLQR2eGVcupXZuGtClq7jE4imyahfuN3", // Secret access key
  region: "us-east-1" //Region
})
const s3 = new AWS.S3();


// Configure application security
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const allowedPaths = ['/login','/signup'];
app.use(function(req,res,next){
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
    if (err || !rows) {
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

app.post('/api/upload', upload.single('sharefile'), async (req, res) => {
  
  const source = req.file.path, 
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
            */
            
          }
        });
      }
      else{
        console.log({'err':err});
      }
    });
})

http.createServer(app).listen(3000)
console.log("Server Started listening on port: 3000")