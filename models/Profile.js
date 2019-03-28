// brings in mongoose from node_modules
const mongoose = require('mongoose');
// saves reference to Schema constructor 'mongoose.model'
// schema constructor, mongoose.model, is used and saved in a const, Schema.
const Schema = mongoose.Schema;

// Create new Schema and name it ProfileSchema
const ProfileSchema = new Schema({  
   user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
   handle: {
      type: String,
      required: true,
      max: 40
   },
   company: {
      type: String,
   },
   website: {
      type: String
   },
   location: {
      type: String
   },
   status: {
      type: String,
      required: true
   },
   skills:{
      type: [String],
      required: true
   },
   bio: {
      type: String
   },
   githubusername: {
      type: String
   },
   experience: [
      {
         title: {
            type: String,
            required: true
         },
      
         company: {
            type: String,
            required: true
         },
         from: {
            type: Date,
            required: true
         },
         to: {
            type: Date
         },
         current: {
            type: Boolean,
            default: false
         },
         description: {
            type: String
         }
         
      }
   ],
   education: [
      {
         school: {
            type: String,
            required: true
         },
         degree: {
            type: String,
            required: true
         },
         fieldofstudy: {
            type: String,
            required: true
         },
         from: {
            type: Date,
            default: false
         },
         to: {
            type: Date
         },
         current: {
            type: Boolean,
            default: false
         },
         description: {
            type: String
         }
      }
   ],
   social: {
      youtube: {
         type: String
      },
      twitter: {
         type: String,
      },
      facebook: {
         type: String
      },
      linkedin: {
         type: String
      },
      instagram: {
         type: String
      }
   },
   date: {
      type: Date,
      default: Date.now // provides a current time-stamp
   }
});

// creates the model from the schema defined above using the mongoose model method and exports the model
module.exports = Profile = mongoose.model('profile', ProfileSchema);