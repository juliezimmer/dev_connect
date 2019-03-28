const express = require('express');
const router = express.Router();
// for using gravatar
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys'); 
const passport = require('passport');

// Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
   const { errors, isValid } = validateRegisterInput(req.body);
   
   // Check Validation, if there are errors, return a 400 status and the entire errors object:
   if(!isValid){
      return res.status(400).json(errors);
}
   // db query looking for the email that the user uses to register, making sure there it isn't already being used. 
   User.findOne({ email: req.body.email})
      .then(user => {
         if(user) {
            errors.email = "Email already exists";
            return res.status(400).json(errors);
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
               });
            });
         }
      });
});

// @route GET api/users/login
// @desc login user/ returning jwt
// @access public
router.post('/login', (req, res) => {
   const { errors, isValid } = validateLoginInput(req.body);
   
   // Check Validation
   if (!isValid) {
      return res.status.s(400).json(errors);
   }

   const email = req.body.email;
   const password = req.body.password;

   // Find user by email
   User.findOne({ email }) 
      .then(user => {
         // check for user
         if(!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
         }

         // check password
         bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
               // User Matched
               // Create JWT payload that is passed into jwt.sign().
               const payload = {
                  id: user.id, // user is provided by User.findOne() above.
                  name: user.name,
                  avatar: user.avatar
               };

               // Sign Token
               // .sign() takes in FOUR parameters:
               // 1. payload with user information as 'payload'. Payload           object created just abovr this code.
               // 2. secret/key as 'keys.secretOrKey'
               // 3. expiration for key as { expiresIn: 3600 } (one hour) 
               // 4. a callback function that returns the token as a response   
               jwt.sign(
                  payload, 
                  keys.secretOrKey, // fron config/keys.js
                  { expiresIn: 3600 }, 
                  (err, token) => {
                     // token is sent back as a response
                     res.json({
                        success: true,
                        token: 'Bearer ' + token
                     });
                  }); 
               } else {
                  errors.password = 'Incorrect Password';
                  return res.status(400).json(errors);
               }
            });
      });
});

// @route  GET api/users/current
// @desc   Return current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
   res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
   });
}); 

module.exports = router;