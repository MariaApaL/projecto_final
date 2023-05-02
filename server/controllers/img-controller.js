
const Event = db.event;
const db = require("../models");
const User = db.user;
const path = require('path');





  exports.uploadUserImg = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Obtenemos la ruta de la imagen subida
      const imagePath = req.file.path;
      console.log(imagePath)
  
      // // Actualizamos el usuario con la ruta de la imagen
      const user = await User.findByIdAndUpdate({ _id: userId }, { $set: { picture: imagePath } });
      console.log(user)
  
      // Devolvemos una respuesta exitosa
      res.status(200).json({ message: 'Imagen subida exitosamente.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error al subir la imagen.' });
    }
  };

  // try {
  //   // Subir la imagen y guardar su ubicación en el servidor
  //   const imagePath = req.file.path;

  //   // Obtener el ID del usuario
  //   const userId = req.params.id;

  //   // Actualizar el atributo "picture" del usuario
  //   const user = await User.findOneAndUpdate({ _id: userId }, { picture: imagePath }, { new: true });

  //   if (!user) {
  //     return res.status(404).send({ message: "Usuario no encontrado" });
  //   }

  //   res.status(200).json({ message: 'Imagen subida exitosamente.', data: user });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: 'Error al subir la imagen.' });
  // }



exports.uploadEventImg = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    event.picture = req.file.path;
    await event.save();

    res.status(200).json({ message: 'Imagen subida exitosamente.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al subir la imagen.' });
  }
}
