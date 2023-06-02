//comprueba si el evento existe.
const db = require("../models");

const Event = db.event;
const User = db.user;



checkIfEventExists = (req, res, next) => {
  Event.findOne({
    name: req.body.name,
    date: req.body.date,
    author: req.body.author
  })
  .exec()
  .then(event => {
    if (event) {
      res.status(400).send({ message: "Error, ya existe un evento con el mismo nombre, fecha y autor" });
      return;
    }
    
    next();
  })
  .catch(err => {
    res.status(500).send({ message: err });
    return;
  });
};
  
  
  module.exports = checkIfEventExists;



const verifyEvent = {
    checkIfEventExists,
  
};

module.exports = verifyEvent;