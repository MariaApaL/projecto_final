const config = require("../config/auth-config");
const palabrasProhibidas = require("../config/badword")
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");



exports.signup = async (req, res) => {
  try {

    const { user, name, email, password, bio, picture } = req.body;
    //Busca si el nombre de usuario o el email contienen palabras incorrectas        
    for (let i = 0; i < palabrasProhibidas.length; i++) {
      if (user.toUpperCase().includes(palabrasProhibidas[i].toLocaleUpperCase()) ||
        email.includes(palabrasProhibidas[i].toLocaleUpperCase()) || name.includes(palabrasProhibidas[i].toLocaleUpperCase()))
        return res.status(400).send({ message: "Error, palabras prohibidas" });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    //controlamos que el nick y el email se creen como minuscula en la base de datos

    user.toLowerCase();
    email.toLowerCase();
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



    res.send({ message: "¡Usuario registrado exitosamente!" });
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
    if (!user) {
      return res.status(404).send({ message: "El Usuario o Contraseña no son correctos." });
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
      expiresIn: 86400 // 24 horas
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


//Actualiza a un usuario por su nombre de usuario

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const { user, name, email, password, bio, picture } = req.body;

    for (let i = 0; i < palabrasProhibidas.length; i++) {
      if (user.toUpperCase().includes(palabrasProhibidas[i].toLocaleUpperCase()) ||
        email.includes(palabrasProhibidas[i].toLocaleUpperCase()) || name.includes(palabrasProhibidas[i].toLocaleUpperCase()))
        return res.status(400).send({ message: "Error, palabras prohibidas" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const updatedUser = {
      user: user.toLowerCase,
      name: name,
      password: hashPassword,
      email:email.toLowerCase,
      bio: bio,
      picture: picture,
    };

    const userExists = await User.findOne({ $or: [{ user: updatedUser.user }, { email: updatedUser.email }], _id: { $ne: userId } });
    if (userExists) {
      return res.status(409).send({ message: "Nombre de usuario o correo electrónico ya está en uso" });
    }

    const newUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if (!newUser) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    res.send({ message: "Usuario actualizado con éxito", user });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar usuario", err });
  }

};

exports.updateUserNoPass = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const { user: newUsername, name, email, bio, picture } = req.body;


    for (let i = 0; i < palabrasProhibidas.length; i++) {
      if (newUsername.toUpperCase().includes(palabrasProhibidas[i].toLocaleUpperCase()) ||
        email.includes(palabrasProhibidas[i].toLocaleUpperCase()) || name.includes(palabrasProhibidas[i].toLocaleUpperCase()))
        return res.status(400).send({ message: "Error, palabras prohibidas" });
    }
    // Verificar si el nuevo nombre de usuario ya está en uso por otro usuario
    if (newUsername && newUsername !== user.user) {
      const existingUser = await User.findOne({ user: newUsername });

      if (existingUser) {
        return res.status(400).send({ message: "Error, este nombre de usuario ya está en uso" });
      }

      user.user = newUsername;
    }

    // Verificar si el nuevo correo electrónico ya está en uso por otro usuario
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        return res.status(400).send({ message: "Error, este correo electrónico ya está en uso" });
      }

      user.email = email;
    }

    // Actualizar los campos permitidos del usuario
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (picture) user.picture = picture;

    // Guardar el usuario actualizado en la base de datos
    const updatedUser = await user.save();

    res.send({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar usuario", err });
  }
};


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

//Elimina a un usuario por su nombre de usuario
exports.deleteUserByUser = async (req, res) => {
  try {
    const { user } = req.body;
    const deletedUser = await User.findOneAndDelete({ user: user.toLowerCase() });
    if (!deletedUser) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.send({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.checkUserExists = async (req, res) => {
  try {
    const { user } = req.body;
    const existingUser = await User.findOne({ $or: [{ username: user }, { email: user }] });
    if (existingUser) {
      return res.status(200).send(existingUser);
    }
    return res.status(404).send('El usuario no existe');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
};