const config = require("../config/auth-config");
const badWords = require("../config/badword");
const transporter = require('../config/nodemailer');
const db = require("../models");
const cloudinary = require("../config/cloudinary");
const User = db.user;
const Role = db.role;
const Event = db.event;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

// function checkBadWord(texto, badWords) {
//   if (!texto) {
//     return false;
//   }
//   return badWords.some(palabra => texto.includes(palabra));
// }

function checkBadWord(texto, badWords) {
  if (!texto) {
    return false;
  }
  const regexp = new RegExp(`\\b(${badWords.join('|')})\\b`, 'i');
  return regexp.test(texto);
}


exports.signup = async (req, res) => {
  try {

    const { user, name, email, password, bio, picture } = req.body;
    //Busca si el nombre de usuario o el email contienen palabras incorrectas  
    if (checkBadWord(user, badWords) || checkBadWord(email, badWords)|| 
    checkBadWord(name, badWords) || checkBadWord(bio, badWords)) {
      return res.status(400).send({ message: "Error, no puede usar ese contenido" });
    }

    const hashPassword = await bcrypt.hash(password, 8);
   
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "1y" // Un año de expiración
    });
    const role = req.body.roles ? await Role.find({ name: { $in: req.body.roles } }) : await Role.findOne({ name: 'user' });
   
     //controlamos que el user y el email se creen como minuscula en la base de datos
    const newUser = new User({

      user: user.toLowerCase(),
      name: name,
      email: email.toLowerCase(),
      password: hashPassword,
      bio: bio,
      picture: picture,
      accessToken: token,
      roles: [role._id]
    });

    
    

  
   
    await newUser.save();


    res.status(200).send({
     user : newUser,
     accessToken: token
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

//Obtiene a todos los usuarios que no estén eliminados
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id}, '-password');
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.send(user);
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
      if (req.body.hasOwnProperty(field)) {
        if (field === "password") {
          const hashedPassword = await bcrypt.hash(req.body[field], 8);
          fieldsToUpdate[field] = hashedPassword;
        } else {
          fieldsToUpdate[field] = req.body[field];
        }
      }
    }

    
  
    const upUser = fieldsToUpdate.hasOwnProperty("user") ? fieldsToUpdate.user.toLowerCase() : null;
    
    const upEmail = fieldsToUpdate.hasOwnProperty("email") ? fieldsToUpdate.email.toLowerCase() : null;
    const upName = fieldsToUpdate.hasOwnProperty("name") ? fieldsToUpdate.name.toLowerCase() : null;
  
    const upBio = fieldsToUpdate.hasOwnProperty("bio") ? fieldsToUpdate.bio.toLowerCase() : null;

    //comprobamos que el nuevo nombre de usuario o el nuevo email no esten en uso
    if (upUser || upEmail) {
      const userExists = await User.findOne({ $or: [{ user: fieldsToUpdate.user }, { email: fieldsToUpdate.email }], _id: { $ne: userId } });
      if (userExists) {
        return res.status(409).send({ message: "ya está en uso, intentelo de nuevo" });
      }
    }
    
    // comprobamos que el nuevo nombre de usuario o el nuevo email no contengan palabras prohibidas

    if (checkBadWord(upUser, badWords) || checkBadWord(upName, badWords)|| 
    checkBadWord(upEmail, badWords) || checkBadWord(upBio, badWords)) {
      return res.status(400).send({ message: "Error, palabras prohibidas" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true });

    res.send({ message: "Usuario actualizado con éxito", updatedUser });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar usuario", err });
  }
};

//Actualiza la foto de un usuario
exports.uploadUserPhoto = async (req, res) => {
  try {
    const userId = req.params.id;
    const picture = req.file.filename;

    // Subir la imagen a Cloudinary utilizando una promesa
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.secure_url);
        }
      });
    });

    // Actualizar el evento con la URL de la imagen subida a Cloudinary
    const user = await User.findByIdAndUpdate(userId, { picture: uploadResult }, { new: true });
    res.status(200).json({ message: 'Imagen subida correctamente', user});
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar la imagen de usuario", error: err });
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

//Encuentra el usuario que ha creado un evento
exports.getUserByEventId = async (req, res) => {
  try {

    const { id } = req.params;
    const event = await Event.findById(id);
   
    if (!event) {
      return res.status(404).json({ error: 'El evento no existe' });
    }

    const user = await User.findById(event.author);
    if (!user) {
      return res.status(404).json({ error: 'El usuario del evento no existe' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al buscar el usuario del evento' });
  }
};


//Añade un evento a los favoritos de un usuario
exports.setFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventId } = req.body;

    // Buscamos el usuario por id y actualizamos sus favoritos
    const user = await User.findByIdAndUpdate(id, { $addToSet: { favorites: eventId } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Evento añadido a favoritos correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al añadir el evento a favoritos' });
  }
}

//Elimina un evento de los favoritos de un usuario
exports.deleteFavorite = async (req, res) => {
  try {
  const { id } = req.params;
  const { eventId } = req.body;
  
  // Comprobamos que el usuario exista
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  // Buscamos y eliminamos el evento de los favoritos del usuario
  const index = user.favorites.indexOf(eventId);
  if (index !== -1) {
    user.favorites.splice(index, 1);
    await user.save();
  }
  
  res.status(200).json({ message: 'Evento eliminado de favoritos correctamente', user });
  } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Ha ocurrido un error al eliminar el evento de favoritos' });
  }
  }


  //Obtiene los favoritos de un usuario
  exports.getFavorites = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Comprobamos que el usuario exista
      const user = await User.findById(id).populate('favorites');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json( user.favorites );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ha ocurrido un error al obtener los favoritos del usuario' });
    }
  }


  //Para el reseteo de contraseña mandando un email con nodemailer
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Busca al usuario por el email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    // Genera un nuevo token de contraseña
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: '1h', 
    });

    // Actualiza la contraseña del usuario con el token generado
    const hashedToken = await bcrypt.hash(token, 8);
    user.password = hashedToken;
    await user.save();

    // Envía el correo electrónico de restablecimiento de contraseña
    const mailOptions = {
      from: 'noreply.goingout@gmail.com',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: `
      <html>
        <head>
          <style>
            h1 {
            
              font-size: 24px;
              font-weight: 600;
              color: #000;
            }
            
          </style>
        </head>
        <body>
          <h1>Hola ${user.name},</h1>
          <p>Se ha solicitado el restablecimiento de contraseña para tu cuenta.</p>
          <p>Utiliza este token para iniciar sesión: ${token}</p>
          <p>Recuerda que este token es válido por 1 hora, por lo que no olvides cambiar tu contraseña.</p>
          <p>Si no has solicitado el restablecimiento de contraseña, puedes ignorar este correo electrónico.</p>
          <p>Saludos,</p>
          <p>Equipo de GoingOut</p>
        </body>
      </html>
    `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        
        return res.status(500).send({ message: 'Ocurrió un error al enviar el correo electrónico' });
      } else {
       
        return res.status(200).send({ message: 'Correo electrónico de restablecimiento de contraseña enviado' });
      }
    });
  } catch (err) {
   
    res.status(500).send({ message: 'Ocurrió un error al restablecer la contraseña' });
  }
};



