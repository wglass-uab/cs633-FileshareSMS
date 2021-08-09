// Required modules
const express = require("express"),
      session = require("express-session"),
      bodyParser = require("body-parser"),
      multer = require('multer'),
      multerS3 = require('multer-s3'),
      fs = require('fs'),
      http = require("http"),
      app = express();
      
app.use(express.static("client",{extensions:['html']}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import AWS and DB methods for insert and select
const {insertIntoUsers, selectFromUsersByLogin, insertIntoShares} = require("./db/database.js");

const {sns, s3} = require('./aws/config.js')

const upload = multer({
   storage: multerS3({
       s3: s3,
       bucket:"uab-cs633-weglass-fileshare-bucket",
       metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
       key: (req, file, cb) => cb(null, Date.now().toString())
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
    console.log("\nFileUpload | " + JSON.stringify(req.file)+"\n");
    
    const s3Link = "/download/" + req.file.key,
          phoneNumbers = Array.from(req.body.phone).filter(number => number && number.length == 10)
    
    phoneNumbers.map(number => {
      sns.publish({
        Message: s3Link, 
        PhoneNumber: '+1' + number,
      })
      .promise()
      .then((data) => console.log("\nSMS sent for number +1" + number + " | " + JSON.stringify(data) + "\n"))
      .catch((err) => console.error(err, err.stack))
      return number
    }).map(number => insertIntoShares({
      email: req.session.username, 
      filekey: req.file.key,
      phone: number
    }, (err, rows) => {
       if (err || !rows) console.error(`Failed insert for email: ${req.session.username}, filekey: ${req.file.key}, phone: ${number}`)
    }));   
    
    res.redirect("/share?key=" + req.file.key);
    return;
  } catch(err) {
    console.error(err);
  }
  
  res.redirect("/share?");
})

app.get('/download/:key', function(req, res){        
  var getParams = {
      Bucket: 'uab-cs633-weglass-fileshare-bucket',
      Key: req.params.key
  }
  
  s3.getObject(getParams, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        res.sendStatus(404);
        return;
      }
      let objectData = data.Body.toString('utf-8');
      res.download(objectData);
  });
});

http.createServer(app).listen(3000)
console.log("Server Started listening on port: 3000")