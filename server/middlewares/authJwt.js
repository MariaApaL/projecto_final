//comprueba si el token que se pasa es válido y extrae al usuario. Comprueba si el usuario tiene 
// rol de admin o no
const jwt = require("jsonwebtoken");
const config = require("../config/auth-config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "El token no ha sido proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ message: "No autorizado" });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({
      _id: { $in: user.roles }
    });
    let isAdmin = false;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        isAdmin = true;
        break;
      }
    }
    if (!isAdmin) {
      res.status(403).send({ message: "Rol Admin requerido!" });
      return;
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;