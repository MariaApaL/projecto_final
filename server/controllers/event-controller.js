
const badWords = require("../config/badword")
const moment = require('moment')
const db = require("../models");
const User = db.user;
const Event = db.event;
const Category = db.category;
const mongoose = require('mongoose');

function checkBadWord(texto, badWords) {
  if (!texto) {
    return false;
  }
  const regexp = new RegExp(`\\b(${badWords.join('|')})\\b`, 'i');
  return regexp.test(texto);
}

function checkNegative(price, plaza) {
  if (price < 0 || plaza < 0) {
    throw new Error("Error, no puede ser negativo");
  }
}

function validateDate(dateString) {
  const today = new Date();
  const oneYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const date = new Date(dateString);
  // if(date <= today || date >= oneYear){
  //   return false;
  // }else {
  //   return true;
  // }
  return date > today && date < oneYear;

}


exports.createEvent = async (req, res) => {
  try {
    const { name, date, location, author, picture, numPlazas, description, price, } = req.body;


    // Comprobar si contiene palabras prohibidas

    if (checkBadWord(name, badWords) || checkBadWord(description, badWords)) {
      return res.status(400).send({ message: "Error , utilice otro vocabulario" });
    }
    //comprueba que no sea negativo

    try {
      checkNegative(price, numPlazas);
    } catch (err) {
      return res.status(400).send({ message: err.message });
    }

    const newDate = validateDate(date);
    if (!newDate) {
      return res.status(400).send({ message: "Error, la fecha no es válida" });
    }

    const existingEvent = await Event.findOne({ author: author, date: date });
    if (existingEvent) {
      return res.status(400).send({ message: "Error, ya tienes un evento en esa fecha" });

    }

    const newEvent = new Event({
      name: name.toLowerCase(),
      date: date,
      location: location,
      picture: picture,
      author: author,
      numPlazas: numPlazas,
      description: description.toLowerCase(),
      price: price,

    });

    const category = req.body.categories ? await Category.findOne({ type: req.body.categories }) : null;
    if (category) {
      newEvent.categories = [category._id];
    }
    await newEvent.save();


    res.send({ message: "¡Evento creado exitosamente!", event: newEvent });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }


};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    // Filtrar los eventos que tienen un autor eliminado
    const filteredEvents = events.filter(event => {
      return event.author !== null;
    });

    res.send(filteredEvents);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id })
    if (!event || !event.author) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.send(event);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}



exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { name, date, location, picture, price, numPlazas, description } = req.body;
    const category = req.body.categories;

    const foundCategories = await Category.find({ type: { $in: category } });
    const categoryIds = foundCategories.map(c => c._id);

    const newDate = moment(date, "DD-MM-YYYY").toDate();
    // Comprobar si contiene palabras prohibidas
    if (checkBadWord(name, badWords) || checkBadWord(description, badWords)) {
      return res.status(400).send({ message: "Error , utilice otro vocabulario" });
    }
    //comprueba que no sea negativo
    checkNegative(price, numPlazas);

    const updateEvent = {
      name: name,
      date: newDate,
      location: location,
      picture: picture,
      numPlazas: numPlazas,
      price: price,
      description: description,
      categories: categoryIds,


    };

    const newEvent = await Event.findByIdAndUpdate(eventId, updateEvent, { new: true });
    res.send({ message: "¡Evento actualizado exitosamente!", event: newEvent });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteByEventId = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);
    if (!eventId) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }
    res.send({ message: "¡Evento eliminado exitosamente!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteEventsByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvents = await Event.deleteMany({ author: id });
    res.status(200).json({ message: `Se han eliminado todos los  eventos` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar los eventos' });
  }
};



exports.deleteEventByNameAndAuthor = async (req, res) => {
  try {
    const { name, author } = req.body;
    const evento = await Event.findOneAndDelete({ name, author });
    if (!evento) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }
    res.send({ message: "Evento eliminado exitosamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getEventCategory = async (req, res) => {
  const { category } = req.params;


  try {
    const foundCategory = await Category.findOne({ type: category });

    if (!foundCategory) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    const categoryId = foundCategory._id;

    const foundEvents = await Event.find({ categories: categoryId });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findEventsByAuthorId = async (req, res) => {
  // const { author } = req.params.id;
  const { id } = req.params;
  try {
    const foundAuthor = await User.findOne({ _id: id});

    if (!foundAuthor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const foundEvents = await Event.find({ author: foundAuthor._id });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getEventsByParticipantId = async (req, res) => {
  const userId = req.params.id;

  try {
    const events = await Event.find({ plazas: userId }).populate('author', 'name');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Ha ocurrido un error al obtener los eventos', error: err });
  }
};



exports.getEventDate = async (req, res) => {
  const { date } = req.body;

  try {
    // Convertir la fecha a formato Date
    const newDate = moment(date, "DD-MM-YYYY").toDate();
    console.log(newDate);

    const foundEvents = await Event.find({ date: newDate });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getEventPlace = async (req, res) => {
  const { location } = req.body;

  try {
    const foundEvents = await Event.find({ location: location });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.getEventWords = async (req, res) => {

  //Usa el query  para buscar en el nombre y la descripción , ya que son muchas palabras
  const { words } = req.query;
  const regex = new RegExp(words.split(' ').join('|'), 'i');
  const events = await Event.find({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
    ],
  });
  res.json(events);
};

exports.getEventPrice = async (req, res) => {

  const { price } = req.body;

  try {
    const foundEvents = await Event.find({ price: price });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

};

exports.addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const isFull = await Event.findOne({ _id: id });
    if (isFull.plazas.length >= isFull.numPlazas) {
      return res.status(400).json({ message: 'No hay plazas disponibles' });
    }
    // Buscamos el evento por id y actualizamos sus participantes
    const event = await Event.findByIdAndUpdate(id, { $addToSet: { plazas: userId } }, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }


    res.status(200).json({ message: 'Usuario añadido correctamente', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al añadir al usuario' });
  }
}

exports.deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Comprobamos que el usuario exista
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Buscamos y eliminamos el evento de los favoritos del usuario
    const index = event.plazas.indexOf(userId);
    if (index !== -1) {
      event.plazas.splice(index, 1);
      await event.save();
    }

    res.status(200).json({ message: 'Plaza eliminada', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar la plaza' });
  }
}


exports.getParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    // Comprobamos que el usuario exista
    const event = await Event.findById(id).populate('plazas');
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json(event.plazas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ha ocurrido un error al obtener los participantes' });
  }
}

//elimina todas las plazas donde el usuario este apuntado
exports.deleteUserPlazas = async (req, res) => {
  const {id} = req.params;

  try {
    // Buscar eventos donde se haya registrado el usuario
    const eventos = await Event.find({ plazas: id });

    // Eliminar al usuario de las plazas de cada evento
    for (const evento of eventos) {
      evento.plazas = evento.plazas.filter(plaza => plaza.toString() !== id);
      await evento.save();
    }

    return res.status(200).json({ message: `Se eliminaron todas las plazas del usuario` });
  } catch (error) {
    return res.status(500).json({ message: 'Hubo un error al eliminar las plazas del usuario', error });
  }
};

exports.addComments = async (req, res) => {
  const { eventId, authorId, text } = req.body;

  try {
    // Comprobamos que el evento exista
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Comprobamos que la fecha es despues
    if (event.date > Date.now()) {
      return res.status(400).json({ message: 'No se pueden añadir comentarios antes de la fecha del evento' });
    }
    console.log("hola");
    // Comprobamos que el usuario ha asistido al evento
    if (!event.plazas.includes(authorId)) {
      console.log(event.plazas.includes(authorId));
      console.log(authorId);

      return res.status(403).json({ message: 'El autor del comentario no ha asistido al evento' });
    }

    // Comprobamos que el usuario no ha comentado malas palabras

    if (checkBadWord(text, badWords)) {
      return res.status(400).send({ message: "Error , contenido inapropiado" });
    }

    const comment = {
      author: authorId,
      text,
      date: Date.now()
    };

    event.comments.push(comment);
    await event.save();

    res.status(201).json({ message: 'Comentario añadido correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al añadir el comentario' });
  }
};

exports.getComments = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const comments = event.comments;
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

exports.deleteComment = async (req, res) => {
  const { eventId, commentId, authorId } = req.body;

  console.log(authorId);
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    const comment = event.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    //para tipar el authorId
    const ObjectId = mongoose.Types.ObjectId;
    if (!comment.author.equals(new ObjectId(authorId))) {
      console.log(comment.author.equals(new ObjectId(authorId)));
      return res.status(403).json({ message: 'Solo el autor del comentario puede borrarlo' });
    }

    event.comments = event.comments.filter(comment => comment._id.toString() !== commentId);
    await event.save();

    res.status(200).json({ message: 'Comentario borrado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al borrar el comentario' });
  }
};

//Borra todos los comentarios de un usuario
exports.deleteUserComments = async (req, res) => {
  try {
    const userId = req.params.id;
    await Event.updateMany(
      { 'comments.author': userId },
      { $pull: { comments: { author: userId } } }
    );
    res.status(200).json({ message: 'Todos los comentarios del usuario han sido eliminados.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar los comentarios del usuario.' });
  }
};