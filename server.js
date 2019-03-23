const express = require('express');
const mongoose = require('mongoose');


const app = express();

// db configuration-bringing in the keys.js file
const db = require('./config/keys').mongoURI;

// connect to mongoDB through mongoose
// this will use a promise and .then 
mongoose.connect(db)
   // success
   .then(() => console.log('connection to db is successful')) 
   // failure to connect
   .catch(err => console.log(err)); // failure


app.get('/', (req, res) => res.send('Hello')); 

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));