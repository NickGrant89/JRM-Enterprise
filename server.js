//Using modual

const morgan = require('morgan'); // Console Logger
const Joi = require('joi');  // Joi is a validator, making code smaller//
const express = require('express'); // Express Framework
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database')
const passport = require('passport');
const fs = require('fs');

const helmet = require('helmet');

/* //Write "Hello" every 500 milliseconds:
var myInt = setInterval(function () {
    User.find({}, 'stream streamkey facebookkey youtubekey', function(err, users){
        // write to a new file named 2pac.txt
        fs.writeFile('./stream.txt', users, (err) => {  
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            console.log('Lyric saved!');
        });
        //console.log("Hello" + users);
    });
    //console.log("Hello");
}, 5000); */

// This calls the Device model to intergate the DB

const ensureAuthenticated = require('../onecEnterprise/middleware/login-auth')
<<<<<<< HEAD
=======

let Site = require('./models/site');
>>>>>>> parent of d327425... Merge pull request #1 from digital1989/Image-Upload

let User = require('./models/user');




// Call Moongoose connection
const mongoose = require('mongoose');
mongoose.connect(config.database,{ useNewUrlParser: true });

// Starting DB connection

let db = mongoose.connection;

db.once('open', function(){
    console.log('MongoDB Live');

})

db.on('error', function(err){
    console.log(err);

});

const app = express();
app.use(express.json());

app.use(helmet());

//Logs all requests to the consol.
app.use(morgan('dev'));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public folder

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'NewSB')))

//Express session Middleware

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  //Express message middleware

  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})


//GET display SB Admin page

app.get('/', ensureAuthenticated, function(req, res){
    User.findById(req.user.id, function(err, user){
       /*  if(user.admin == 'Super Admin'){
           return res.redirect('/admin/dashboard')
        }  */
        //console.log(user)

        User.find({}, function(err, users){
            
                        User.countDocuments({'company': user.company}, function(err, numOfUsers) {
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.render('index', {
                                    title:'Dashboard',
                                    users:users,
                                    numOfUsers:numOfUsers,
                                });
                            }
                        });        
                    });  
                });
            });
        



// Route File

//API Routes

let users = require('./routes/users');
<<<<<<< HEAD
let relays = require('./routes/relays');


//Display Routes


=======
let jwt = require('./routes/apiJWT');
let apiFileTf = require('./routes/apiFileTransfer');
let apiDevices = require('./routes/apiDevices');
let apiCompany = require('./routes/apiCompany');
let apiOutworkers = require('./routes/apiOutworkers');
let apiRepairs = require('./routes/apiRepairs');
let apiCustomers = require('./routes/apiCustomer');

//Display Routes

let companies = require('./routes/companies');
let site = require('./routes/sites');
let outworkers = require('./routes/outworkers');
let repairs = require('./routes/repairs');
let customers = require('./routes/customers');
>>>>>>> parent of d327425... Merge pull request #1 from digital1989/Image-Upload
let admin = require('./routes/admin');


app.use('/users', users);
<<<<<<< HEAD
<<<<<<< HEAD
app.use('/relays', relays);


=======
=======
>>>>>>> parent of d327425... Merge pull request #1 from digital1989/Image-Upload
app.use('/api/v1/filetransfer/', apiFileTf);
app.use('/api/v1/devices/', apiDevices);
app.use('/api/v1/company/', apiCompany);
app.use('/api/v1/outworker/', apiOutworkers);
app.use('/api/v1/repairs/', apiRepairs);
app.use('/api/v1/customers/', apiCustomers);
app.use('/api/v1/auth/', jwt);

app.use('/companies', companies);
app.use('/sites', site);
app.use('/outworkers', outworkers);
app.use('/repairs', repairs);
app.use('/customers', customers);
>>>>>>> parent of d327425... Merge pull request #1 from digital1989/Image-Upload
app.use('/admin', admin);

/* app.use('*', function(req, res) {
    res.status(404).end();
    res.redirect('/');
});  */

const port = process.env.Port || 3000;

app.listen(port, process.env.IP || '192.168.178.23', () => console.log('Example app listening on port' + ' ' + port +  '!'))
