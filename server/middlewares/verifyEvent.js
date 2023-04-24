//comprueba si el evento existe.
const db = require("../models");

const Event = db.event;
const User = db.user;



checkIfEventExists = (req, res, next) => {
    Event.findOne({
      name: req.body.name
    }).exec()
      .then(name => {
        if (name) {
          res.status(400).send({ message: `Error, el Evento con ese nombre ya existe` });
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