//comprueba si el usuario existe por el user y el mail y el rol que tiene.
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;


checkIfEmailOrUserExists = (req, res, next) => {
  User.findOne({
    user: req.body.user
  }).exec()
    .then(user => {
      if (user) {
        res.status(400).send({ message: `Error, el Usuario ya existe` });
        return;
      }

      // busca el email
      User.findOne({
        email: req.body.email
      }).exec()
        .then(user => {
          if (user) {
            res.status(400).send({ message: "Error, este email ya está en uso" });
            return;
          }

          next();
        })
        .catch(err => {
          res.status(500).send({ message: err });
          return;
        });
    })
    .catch(err => {
      res.status(500).send({ message: err });
      return;
    });
};

checkRolesExists = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Error, el rol ${req.body.roles[i]} no existe`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkIfEmailOrUserExists,
  checkRolesExists
};

module.exports = verifySignUp;