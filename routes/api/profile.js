const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation
const validateProileInput = require('../../validation/profile');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');

// @route GET api/profile/test
// @desc tests profile route
// @access public
router.get('/test', (req, res) => res.json({msg: "profile works"}));

// @route  GET api/profile
// @desc   Gets current user's profile
// @access private route
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
   // initialize an empty errors object
   const errors = {};
   
   // the jwt that is passed into possport.authenticate() puts the user's  into req.user, which is how the user's information is accessed.   
      Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
         // checks for a profile
         if(!profile) { // if there is no profile
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
         } 
         // A profile for the current user exists:
         res.json(profile);
      })
      // if there is a problem with the findOne request, a 404 status code is sent along with the error that occurred:
      .catch(err => res.status(404).json(err));
   }
);
// Route to get all of the profiles
// @route  GET api/profile/all 
// @desc   Gets all profiles 
// @access public route (no need for passport.authenticate)
router.get('/all', (req, res) => {
   // initialize errors object
   const errors = {};

   Profile.find()
   .populate('user', ['name', 'avatar'])
      .then(profiles => {
         if(!profiles) {
            errors.noprofile = "There are no profile for this user";
            return res.status(404).json(errors); 
         }
         res.json(profiles);
      })
      .catch(err => res.status(404).json({profile: "There are no profiles" })
   );
});   

// @route  GET api/profile/handle/:handle
// @desc   Gets profile by user handle
// @access public route (no need for passport.authenticate)
router.get('/handle/:handle', (req, res) => {
   // initialize errors object
   const errors = {};
   
   Profile.findOne({handle:req.params.handle}) 
      .populate('user', ['name', 'avatar'])  
      .then(profile => { // check for profile with this specified handle
         if(!profile) {
            // no profile
            // add noprofile to errors object
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors);
         } 
         // profile is found
         res.json(profile);
      }) 
      .catch(err => res.status(404).json(err));
})

// @route  GET api/profile/user/:user_id
// @desc   Gets profile by user ID
// @access public route (no need for passport.authenticate)

router.get('/user/:user_id', (req, res) => {
   // initialize errors object
   const errors = {};
   
   Profile.findOne({ user: req.params.user_id}) 
      .populate('user', ['name', 'avatar'])  
      .then(profile => { // check for profile with this specified handle
         if(!profile) {
            // no profile
            // add noprofile to errors object
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors);
         } 
         // profile is found
         res.json(profile);
      }) 
      .catch(err => res.status(404).json({profile: "There is no profile for this user"}));
})

// @route  POST api/profile
// @desc   Create or Edit User profile
// @access private route
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {  // the fields needed are in req.body
   // destructuring
   const { errors, isValid } = validateProfileInput(req.body);

   // Check validation
   if(!isValid) {
      // return any errors with status 400
      return res.status(400).json(errors);
   }

   // get fields
   // everything that is fetched in this request will go into an object, profileFields:
   const profileFields = {};
   profileFields.user = req.user.id;
   if(req.body.handle) profileFields.handle = req.body.handle;
   if(req.body.company) profileFields.company = req.body.company;
   if(req.body.website) profileFields.website = req.body.website;
   if(req.body.location) profileFields.location = req.body.location;
   if(req.body.bio) profileFields.bio = req.body.bio;
   if(req.body.status) profileFields.status = req.body.status;
   if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
   // Skills - split into array
   // creates the array of skills
   if(typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
   }
   // Social Media
   profileFields.social = {};
   if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
   if(req.body.twitter) profileFields.social.twitter= req.body.twitter;
   if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
   if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
   if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

   // req.user.id is the logged in user
   // this searches for the id of the logged in user
   Profile.findOne({ user: req.user.id})
      .then(profile => {
         if(profile) { // if there IS a profile, it means this is an update
            // Update
            Profile.findOneAndUpdate(
               { user: req.user.id }, 
               { $set: profileFields }, 
               { new: true}
            )
            .then(profile => res.json(profile));
         } else { 
            // Create profile

            // check if handle exists
            profile.findOne({ handle: profileFields.handle}).then(profile => {
               // a profile comes back that matches the handler, send an error
               if(profile){
                  errors.handle = 'That handle already exists'; 
                  res.status(400).json(errors);
               }
               // Save Profile 
               new Profile(profileFields).save().then(profile => res.json(profile))
            })
         }
      })
   }
);

// @route  POST api/profile/experience
// @desc   Adds Experience to profile
// @access private route 
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
   Profile.findOne({ user: req.user.id })
      .then(profile => {
         // the experience object
         const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
         }
         // Add to exp array
         profile.experience.unshift(newexp);

         // save existing profile
         profile.save().then(profile => res.json(profile));
      })
});

module.exports = router;