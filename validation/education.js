const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
   // initialize errors object
   let errors = {}; // this starts as an empty object, validation runs, and if there are no errors, it will be empty at the end and it will be valid. 

   data.school = !isEmpty(data.school) ? data.school : '';
   data.degree = !isEmpty(data.degree) ? data.degree : '';
   data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
   data.from = !isEmpty(data.from) ? data.from : '';

   if (Validator.isEmpty(data.school)) {
      errors.school = 'School field is required ';
   }

   if (Validator.isEmpty(data.degree)) {
      errors.degree = 'Degree field is required ';
   }

   if (Validator.isEmpty(data.fieldofstudy)) {
      errors.fieldofstudy = 'Field of stufy field is required ';
   }

   if (Validator.isEmpty(data.from)) {
      errors.from = 'From date field is required';
   }

   
   return {
      errors,
      isValid: isEmpty(errors)
   };
};