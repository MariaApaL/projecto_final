
const badWords = require("../config/badword")
const moment = require('moment');
const db = require("../models");
const User = db.user;
const Event = db.event;
const Category = db.category;
const mongoose = require('mongoose');
const cloudinary = require("../config/cloudinary");

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
    const { name, date, location, author, numPlazas, description, price, category } = req.body;

    // Comprobar si contiene palabras prohibidas
    if (checkBadWord(name, badWords) || checkBadWord(description, badWords)) {
      return res.status(400).send({ message: "Error, utilice otro vocabulario" });
    }

    // Comprueba que no sea negativo
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
      author: author,
      numPlazas: numPlazas,
      description: description.toLowerCase(),
      price: price,
    });

  
    if (category) {
      const categoryObject = await Category.findOne({ type: category });

      if (categoryObject) {
        newEvent.category = categoryObject._id;
      }
    }


    await newEvent.save();

    res.send({ message: "¡Evento creado exitosamente!", event: newEvent });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.uploadEventPhoto = async (req, res) => {
  try {
    const eventId = req.params.id;
   

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
    const event = await Event.findByIdAndUpdate(eventId, { picture: uploadResult }, { new: true });
    res.status(200).json({ message: 'Imagen subida correctamente', event });
  } catch (error) {

    res.status(500).json({ error: 'Error en el servidor' });
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
    const { name, date, location, price, numPlazas, description, category } = req.body;

    

    // Comprobar si contiene palabras prohibidas
    if (checkBadWord(name, badWords) || checkBadWord(description, badWords)) {
      return res.status(400).send({ message: "Error, utilice otro vocabulario" });
    }

    // Comprueba que no sea negativo
    checkNegative(price, numPlazas);

    const updateEvent = {
      name: name,
      date: date,
      location: location,
      numPlazas: numPlazas,
      price: price,
      description: description,
    };

    let newEvent;

    if (category) {
      const categoryObject = await Category.findOne({ type: category });

      if (categoryObject) {
        updateEvent.category = categoryObject._id;
      }
    }

    newEvent = await Event.findByIdAndUpdate(eventId, updateEvent, { new: true });
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

// Eliminar todos los eventos de un autor
exports.deleteEventsByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvents = await Event.deleteMany({ author: id });
    res.status(200).json({ message: `Se han eliminado todos los  eventos` });
  } catch (error) {
    
    res.status(500).json({ message: 'Ha ocurrido un error al eliminar los eventos' });
  }
};


// Eliminar un evento por nombre y autor
exports.deleteEventByIdAndAuthor = async (req, res) => {
  try {
    const { eventId, author } = req.body;
    const evento = await Event.findOneAndDelete({ _id: eventId, author });
    if (!evento) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }
    res.send({ message: "Evento eliminado exitosamente" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// ENCUENTRA   todos los eventos de un autor
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

// obtener eventos donde el usuario es participante
exports.getEventsByParticipantId = async (req, res) => {
  const userId = req.params.id;

  try {
    const events = await Event.find({ plazas: userId }).populate('author', 'name');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Ha ocurrido un error al obtener los eventos', error: err });
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



//Borra todos los comentarios de un usuario
exports.deleteUserValuations = async (req, res) => {
  try {
    const userId = req.params.id;
    await Event.updateMany(
      { 'valuations.author': userId },
      { $pull: { valuations: { author: userId } } }
    );
    res.status(200).json({ message: 'Todos los comentarios del usuario han sido eliminados.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar los comentarios del usuario.' });
  }
};

exports.deleteUserValuation = async (req, res) => {
  try {
    const userId = req.params.userId;
    const valuationId = req.params.valuationId;

    await Event.updateOne(
      { 'valuations._id': valuationId, 'valuations.author': userId },
      { $pull: { valuations: { _id: valuationId } } }
    );

    res.status(200).json({ message: 'El comentario del usuario ha sido eliminado.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el comentario del usuario.' });
  }
};

exports.addValuation = async (req, res) => {
  try {
    const eventId = req.params.id;
    const {value, userId, text} = req.body; 
    
    // Busca el evento por su ID
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }
    
     // Comprobamos que la fecha es después
     if (event.date > Date.now()) {
      return res.status(400).json({ message: 'No se pueden añadir comentarios antes de la fecha del evento' });
    }

    // Comprobamos que el usuario ha asistido al evento
    if (!event.plazas.includes(userId)) {
      return res.status(403).json({ message: 'El autor del comentario no ha asistido al evento' });
    }

    // Verifica si el usuario creador ya ha valorado el evento
    const hasValuation = event.valuations.some(valuation => valuation.author.toString() === userId);
    
    if (hasValuation) {
      return res.status(400).send({ message: "El usuario ya ha valorado este evento" });
    }

    if (checkBadWord(text, badWords)) {
      return res.status(400).send({ message: 'Error, contenido inapropiado' });
    }
    
    // Crea una nueva valoración con el valor proporcionado en la solicitud
    const newValuation = {
      value: value, 
      author: userId,
      date: Date.now(),
      text
    };
    
    // Agrega la nueva valoración al arreglo de valoraciones del evento
    event.valuations.push(newValuation);
    
    // Guarda los cambios en el evento
    await event.save();
    
    res.send({ message: "Valoración añadida con éxito", newValuation });
  } catch (err) {
    res.status(500).send({ message: "Error al añadir la valoración", error: err });
  }
};

exports.getEventValuations = async (req, res) => {
  try {
    const eventId = req.params.id;
    
    // Busca el evento por su ID e incluye el usuario y el campo picture
    const event = await Event.findById(eventId).populate({
      path: 'valuations.author',
      select: 'user picture' // Incluye los campos 'user' y 'picture' del autor
    });
    
    if (!event) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }
    
    // Extrae todas las valoraciones del evento
    const valuations = event.valuations;
    if(valuations.length === 0){
      return res.status(404).send({ message: "No hay valoraciones para este evento" });
    }
    
    res.send({ valuations });
  } catch (err) {
    res.status(500).send({ message: "Error al obtener las valoraciones del evento", error: err });
  }
};

exports.getEventValuationsByAuthor = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const authorId = req.params.authorId;
    
    // Busca el evento por su ID y las valoraciones del autor especificado
    const event = await Event.findById(eventId).populate({
      path: 'valuations',
      match: { author: authorId }
    });
    
    if (!event) {
      return res.status(404).send({ message: "Evento no encontrado" });
    }

    // Filtra las valoraciones
    const valuations = event.valuations.filter(valuation => valuation.author && valuation.author.toString() === authorId);
    
    res.send({ valuations });
  } catch (err) {
    res.status(500).send({ message: "Error al obtener las valoraciones del evento por el autor", error: err });
  }
};

exports.getValuationsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;
    
    // Busca todos los eventos del autor
    const events = await Event.find({ author: authorId });
    
    // Obtiene todas las valoraciones de los eventos del autor
    const valuations = events.flatMap(event => event.valuations);
    
    res.send({ valuations });
  } catch (err) {
    res.status(500).send({ message: "Error al obtener las valoraciones del autor", error: err });
  }
};
