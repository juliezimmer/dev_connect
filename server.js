const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // see required middleware added below
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// db configuration-bringing in the keys.js file
const db = require('./config/keys').mongoURI;

// connect to mongoDB through mongoose
// this will use a promise and .then 
mongoose.connect(db, { useNewUrlParser: true })
   // success
   .then(() => console.log('connection to db is successful')) 
   // failure to connect
   .catch(err => console.log(err)); // failure

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));