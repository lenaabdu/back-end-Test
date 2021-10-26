// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ObjectId } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const mongoose = require('mongoose');
const { Ad } = require('../models/ad');
const { users} = require('../models/user');
const path = require("path");
//const dburi =
var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://lena:lena@cluster0.rqupx.mongodb.net/auth?retryWrites=true&w=majority',
 {

    userNewUrlParser: true,
    useUnifiedTopology: true
});

// defining the Express app
const app = express();
const port = process.env.PORT || 7000
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


app.post('/register', async(req, res) => {
    const newUser= req.body;
    const user = new users(newUser);
   // res.send({ message: 'New user inserted.' });
   user.token = uuidv4()
   await user.save()
   res.send({ token: user.token })
});


// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });

 
  
  // The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
  // You can create multiple middleware each with a different storage engine config so save different files in different locations on server
  const upload = multer({ storage: fileStorageEngine });
  
  // Single File Route Handler
  app.post("/single", upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send("Single FIle upload success");
  });









app.post('/auth', async(req, res) => {
    const user = await users.findOne({ username: req.body.username })
    if (!user) {
        return res.sendStatus(401)
    }
    if (req.body.password !== user.password) {
        return res.sendStatus(403)
    }
    user.token = uuidv4()
    await user.save()
    res.send({ token: user.token })
})

app.use(async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const user = await users.findOne({ token: authHeader })
    if (user) {
        next()
    } else {
        res.sendStatus(403)
    }
})

// defining an endpoint to return all ads
app.get('/', async(req, res) => {
    res.send(await Ad.find());
});
app.post('/', async(req, res) => {
    const newAd = req.body;
    const ad = new Ad(newAd);
    await ad.save();
    res.send({ message: 'New ad inserted.' });
});

app.delete('/:id', async(req, res) => {
    await Ad.deleteOne({ _id: ObjectId(req.params.id) })
    res.send({ message: 'Ad removed.' });
});

app.put('/:id', async(req, res) => {
    await Ad.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body)
    res.send({ message: 'Ad updated.' });
});

 
 
// starting the server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Remote Database Connected")
});
