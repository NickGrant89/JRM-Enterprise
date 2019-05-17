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

const helmet = require('helmet');


// This calls the Device model to intergate the DB

const ensureAuthenticated = require('./middleware/login-auth')

let Site = require('./models/site');

let User = require('./models/user');

let Company = require('./models/company');

let Repair = require('./models/repair');

let Customer = require('./models/customer');

let Outworker = require('./models/outworker');


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

app.use('/uploads', express.static('uploads'));

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
    Site.find({'name': user.sites}, function(err, sites){
        User.find({}, function(err, users){
            Company.find({}, function(err, companies){
            Repair.countDocuments({'company':user.company}, function(err, numOfRepairs) {
                Customer.countDocuments({'company': user.company}, function(err, numOfCustomers) {
                    Outworker.countDocuments({'company': user.company}, function(err, numOfOutworkers) {
                        User.countDocuments({'company': user.company}, function(err, numOfUsers) {
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.render('index', {
                                    title:'Dashboard',
                                    sites: sites,
                                    users:users,
                                    companies:companies,
                                    numOfRepairs: numOfRepairs,
                                    numOfCustomers: numOfCustomers,
                                    numOfOutworkers:numOfOutworkers,
                                    numOfUsers:numOfUsers,
                                    test:44,
                                });
                            }
                        });        
                    });  
                });
            });
        });         
    });
});
});
});

// Route File

//API Routes

let users = require('./routes/users');
let jwt = require('./routes/apiJWT');
let apiDevices = require('./routes/apiDevices');
let apiCompany = require('./routes/apiCompany');
let apiOutworkers = require('./routes/apiOutworkers');
let apiRepairs = require('./routes/apiRepairs');
let apiCustomers = require('./routes/apiCustomer');

//Display Routes

let site = require('./routes/sites');
let outworkers = require('./routes/outworkers');
let repairs = require('./routes/repairs');
let customers = require('./routes/customers');
let admin = require('./routes/admin');


app.use('/users', users);
app.use('/api/v1/devices/', apiDevices);
app.use('/api/v1/company/', apiCompany);
app.use('/api/v1/outworker/', apiOutworkers);
app.use('/api/v1/repairs/', apiRepairs);
app.use('/api/v1/customers/', apiCustomers);
app.use('/api/v1/auth/', jwt);

app.use('/sites', site);
app.use('/outworkers', outworkers);
app.use('/repairs', repairs);
app.use('/customers', customers);
app.use('/admin', admin);

app.use('*', function(req, res) {
    res.status(404).end();
    res.redirect('/');
}); 

const port = process.env.Port || 3000;

app.listen(port, process.env.IP || '192.168.178.23', () => console.log('Example app listening on port' + ' ' + port +  '!'))
