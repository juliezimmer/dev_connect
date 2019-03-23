const express = require('express');
const router = express.Router();
// for using gravatar
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model/schema 
const User = require('../../models/User');

// @route GET api/users/test
// @desc tests users route
// @access public
router.get('/test', (req, res) => res.json({msg: "users works"}));


// @route  GET api/users/register
// @desc   registers user  
// @access public
router.post('/register', (req, res ) => {
   // db query looking for the email that the user uses to register, making sure there it isn't already being used. 
   User.findOne({ email: req.body.email})
      .then(user => {
         if(user) {
            return res.status(400).json({email: 'Email already exists' });
         } else { // if user does't exist
            const avatar = gravatar.url(req.body.email, {
               s: '200', // size of avatar
               r: 'pg', // rating
               d: 'mm' // default 
            });
            const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               avatar,
               password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) =>{
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save()
                     .then(user => res.json(user))
                     .catch(err => console.log(err));
               })
            })
         }
      })
});

module.exports = router;