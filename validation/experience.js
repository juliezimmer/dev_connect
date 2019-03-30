const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
   // initialize errors object
   let errors = {}; // this starts as an empty object, validation runs, and if there are no errors, it will be empty at the end and it will be valid. 

   data.title = !isEmpty(data.title) ? data.title : '';
   data.company = !isEmpty(data.company) ? data.company : '';
   data.from = !isEmpty(data.from) ? data.from : '';

   if (Validator.isEmpty(data.title)) {
      errors.title = 'Job title is required ';
   }

   if (Validator.isEmpty(data.company)) {
      errors.company = 'Company field is required ';
   }

   if (Validator.isEmpty(data.from)) {
      errors.from = 'From date field is required';
   }
   
   return {
      errors,
      isValid: isEmpty(errors)
   };
};