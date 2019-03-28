const isEmpty = (value) => 
   value === undefined || 
   value === null || 
   (typeof value === 'object' && Object.keys(value).length === 0) ||
   (typeof value === 'string' && value.trim().length === 0);
   
module.exports = isEmpty;



// (Object.keys(value).length === 0) ==> it's an empty object

// This custom isEmpty function checks for:
//   undefined
//   null 
//   empty object  
//   empty string

// Using regular function syntax
// function isEmpty(value){
//    return (
//       value === undefined || value === null || 
//       (typeof value === 'object' && Object.keys(value).length === 0) ||
//       (typeof value === 'string' && value.trim().length === 0)
//    );
// }