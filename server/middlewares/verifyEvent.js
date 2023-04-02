// //comprueba si el evento existe.
// const db = require("../models");
// const User = db.user;
// const Event = db.event;



// const checkIfEventExists = (req, res, next) => {
//     const eventId = req.body._id;
  
//     Event.findOne({
//       id:req.body.id
//     }).exec()
//       .then(id => {
//         if (id) {
//           res.status(400).send({ message: `Error, el evento ya existe` });
//           return;
//         }
  
//         next();
//       })
//       .catch(err => {
//         res.status(500).send({ message: err });
//         return;
//       });
     
//   };
  
//   module.exports = checkIfEventExists;



// const verifyEvent = {
//     checkIfEventExists,
  
// };

// module.exports = verifyEvent;