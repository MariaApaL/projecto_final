const config = require("../config/auth-config");
const badWords = require("../config/badword")
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

function checkBadWord(texto, badWords) {
  if (!texto) {
    return false;
  }
  return badWords.some(palabra => texto.includes(palabra));
}


exports.signup = async (req, res) => {
  try {

    const { user, name, email, password, bio, picture } = req.body;
    //Busca si el nombre de usuario o el email contienen palabras incorrectas  
    if (checkBadWord(user, badWords) || checkBadWord(email, badWords)|| 
    checkBadWord(name, badWords) || checkBadWord(bio, badWords)) {
      return res.status(400).send({ message: "Error, elija otro vocabulario" });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    //controlamos que el nick y el email se creen como minuscula en la base de datos


    const newUser = new User({

      user: user.toLowerCase(),
      name: name,
      email: email.toLowerCase(),
      password: hashPassword,
      bio: bio,
      picture: picture,
    });

    //Asigna el rol pero si no, se asigna user por defecto
    const role = req.body.roles ? await Role.find({ name: { $in: req.body.roles } }) : await Role.findOne({ name: 'user' });

    newUser.roles = [role._id];
    await newUser.save();


    res.send({ 
      message: "¡Usuario registrado exitosamente!",
      user: newUser 
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//Se controla que el usuario pueda hacer login con el user o con el email
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { user: req.body.user },
        { email: req.body.email }
      ]
    }).populate("roles", "-__v");
    if (!user || user.deleted == true) {
      return res.status(404).send({ message: "El Usuario o Contraseña no son correctos." });
    } else if (user.blocked == true) {
      return res.status(404).send({ message: "El Usuario esta bloqueado." });

    }


    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "El Usuario o Contraseña no son correctos."
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "1y" // Un año de expiración
    });

    const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      id: user._id,
      user: user.user,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//Obtiene a todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


//Actualiza a un usuario con su id
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const fieldsToUpdate = {};
    for (const field in req.body) {
      console.log("field:", field);
      if (req.body.hasOwnProperty(field)) {
        console.log(req.body.hasOwnProperty(field));
        fieldsToUpdate[field] = req.body[field];
    }
    }

    //console.log(fieldsToUpdate);
    const upUser = fieldsToUpdate.hasOwnProperty("user") ? fieldsToUpdate.user.toLowerCase() : null;
    
    const upEmail = fieldsToUpdate.hasOwnProperty("email") ? fieldsToUpdate.email.toLowerCase() : null;
    const upName = fieldsToUpdate.hasOwnProperty("name") ? fieldsToUpdate.name.toLowerCase() : null;
   console.log(upName);
    const upBio = fieldsToUpdate.hasOwnProperty("bio") ? fieldsToUpdate.bio.toLowerCase() : null;

    //comprobamos que el nuevo nombre de usuario o el nuevo email no esten en uso
    if (upUser || upEmail) {
      const userExists = await User.findOne({ $or: [{ user: fieldsToUpdate.user }, { email: fieldsToUpdate.email }], _id: { $ne: userId } });
      if (userExists) {
        return res.status(409).send({ message: "ya está en uso, intentelo de nuevo" });
      }
    }
    
    // comprobamos que el nuevo nombre de usuario o el nuevo email no contengan palabras prohibidas

    // if (checkBadWord(upUser, badWords) || checkBadWord(upName, badWords)|| 
    // checkBadWord(upEmail, badWords) || checkBadWord(upBio, badWords)) {
    //   return res.status(400).send({ message: "Error, palabras prohibidas" });
    // }

    const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true });
    res.send({ message: "Usuario actualizado con éxito", updatedUser });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar usuario", err });
  }
};

//CON ESTE UPDATE NO PUEDO ACTUALIZAR LOS CAMPOS QUE YO QUIERA.
// exports.updateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const { user, name, email, password, bio, blocked, deleted, picture } = req.body;

//     checkWords(user, name, email, bio);

//     const hashPassword = await bcrypt.hash(password, 8);

//     const updatedUser = {
//       user: user.toLowerCase,
//       name: name,
//       password: hashPassword,
//       email: email.toLowerCase,
//       bio: bio,
//       picture: picture,
//       blocked: blocked,
//       deleted:deleted,
//     };

//     const userExists = await User.findOne({ $or: [{ user: updatedUser.user }, { email: updatedUser.email }], _id: { $ne: userId } });
//     if (userExists) {
//       return res.status(409).send({ message: "Nombre de usuario o correo electrónico ya está en uso" });
//     }

//     const newUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
//     if (!newUser) {
//       return res.status(404).send({ message: "Usuario no encontrado" });
//     }

//     res.send({ message: "Usuario actualizado con éxito", user });
//   } catch (err) {
//     res.status(500).send({ message: "Error al actualizar usuario", err });
//   }

// };

//Elimina a un usuario por su id

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body._id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.send({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.getUser = async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, config.secret);
    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    return res.status(200).send(existingUser);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error interno del servidor" });
  }
};

// exports.getUser = async (req, res) => {
//   try {
//     // Verificar el token de acceso antes de permitir el acceso al controlador
//     await verifyToken(req, res);
//     const user = await User.findById(req.body.id); // selecciona todos los campos excepto la contraseña
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };