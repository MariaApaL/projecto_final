const config = require("../config/auth-config");
const badWords = require("../config/badword")
const db = require("../models");
const User = db.user;
const Role = db.role;
const Report = db.report;

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

//Obtiene a todos los usuarios que no estén eliminados
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ deleted: false }, '-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }, '-password');
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

    if (checkBadWord(upUser, badWords) || checkBadWord(upName, badWords)|| 
    checkBadWord(upEmail, badWords) || checkBadWord(upBio, badWords)) {
      return res.status(400).send({ message: "Error, palabras prohibidas" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true });

    if (updatedUser.deleted) {
      res.status(204).send();
    } 

    res.send({ message: "Usuario actualizado con éxito", updatedUser });
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

// exports.setFavorite = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { eventId } = req.body;

//     // Comprobamos que el usuario exista y agregamos el evento a sus favoritos si no existe
//     const result = await User.findOneAndUpdate(
//       { _id: id, favorites: { $ne: eventId } },
//       { $addToSet: { favorites: eventId } }
//     );

//     if (!result) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     res.status(200).json({ message: 'Evento añadido a favoritos correctamente' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Ha ocurrido un error al añadir el evento a favoritos' });
//   }
// };



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



exports.addReportToUser = async (req, res) => {
  try {
    // Verificamos que exista el usuario y el report
    const { id} = req.params;
    const {reportId} = req.body;
    const user = await User.findById(id);
    const report = await Report.findOne({ type: reportId});
    if (!user || !report) {
      return res.status(404).json({ message: 'No se encontró el usuario o el reporte.' });
    }
    // Añadimos el reporte al usuario y guardamos los cambios
    user.reports.push(report);
    await user.save();
    res.status(200).json({ message: 'Se ha añadido el reporte al usuario.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al añadir el reporte al usuario.' });
  }
};

exports.getReportsByType = async (req, res) => {
  try {
    // Verificamos que exista el usuario y el tipo de reporte
    const { id } = req.params;
    const {reportType} = req.body;
    const user = await User.findById(userId).populate('reports');
    if (!user) {
      return res.status(404).json({ message: 'No se encontró el usuario.' });
    }
    const reportsByType = user.reports.filter(report => report.type === reportType);
    res.status(200).json({ reports: reportsByType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al obtener los reportes por tipo.' });
  }
};

// exports.addValuation = async (req, res) => {
//   const id = req.params.id;
//   const valuation = req.body.valuation;
//   const userId = req.body.userId;
//   const now = new Date();

//   try {
//     const event = await Event.findById(id);

//     // Comprobar si la fecha actual es posterior a la creación del evento
//     if (now < event.createdAt) {
//       return res.status(400).json({ message: 'No se puede añadir una valoración antes de la fecha de creación del evento.' });
//     }

//     // Comprobamos que el usuario ha asistido al evento
//     if (!event.plazas.includes(userId)) {
//       return res.status(403).json({ message: 'El autor del comentario no ha asistido al evento' });
//     }
//     event.valuations.push(valuation);
//     await event.save();

//     res.status(200).json({ message: 'Valoración añadida correctamente.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error al añadir valoracion' });
//   }
// }

// exports.getValuationsByUser = async (req, res, next) => {
//   try {
//     const events = await Event.find({ author: req.params.id }).populate('valuations');
//     const valuations = events.reduce((acc, event) => {
//       acc.push(...event.valuations);
//       return acc;
//     }, []);
//     res.status(200).json(valuations);
//   } catch (error) {
//     next(error);
//   }
// };
// exports.updateUserImg = async (req, res) => {
//     try{

//       const userId = req.params.id;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send({ message: "Usuario no encontrado" });
    
//     }
//      const picture = req.body.picture;
//       const updatedUser = {
//       picture: picture
//     };


//     const newUser = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
//     if (!newUser) {
//       return res.status(404).send({ message: "Usuario no encontrado" });
//     }

//     res.send({ message: "Usuario actualizado con éxito", user });



//     }catch(err){
//         res.status(500).json({ message: err.message });
//     }
// };



