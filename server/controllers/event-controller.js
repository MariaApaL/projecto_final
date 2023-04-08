
const palabrasProhibidas = require("../config/badword")
const moment = require('moment')
const db = require("../models");
const User = db.user;
const Event = db.event;
const Category = db.category;


function checkWords(...args) {
  for (let i = 0; i < palabrasProhibidas.length; i++) {
    if (args[i].toUpperCase().includes(palabrasProhibidas[i].toLocaleUpperCase()))
      return res.status(400).send({ message: "Error, palabras prohibidas" });
  }
}

function checkPrice(price){
  if(price < 0){
    return res.status(400).send({ message: "Error, el precio no puede ser negativo" });
  }
}

exports.createEvent = async (req, res) => {
  try {
    const { name, date, location, author, picture, numPlazas, description , price } = req.body;
    
    

    // Comprobar si el usuario existe
    const existingAuthor = await User.findOne({ _id: author });
    if (!existingAuthor) {
      return res.status(400).send({ message: "Error, el usuario especificado no existe" });
    }

    // Comprobar si contiene palabras prohibidas
    checkWords(name, description);
    //comprueba que no sea negativo
    checkPrice(price);

    const moment = require("moment");

    const newDate = moment(date, "DD-MM-YYYY").toDate();
    const newEvent = new Event({
      name: name.toLowerCase(),
      date: newDate,
      location: location,
      picture: picture,
      author: existingAuthor,
      numPlazas: numPlazas,
      description: description.toLowerCase(),
      price: price,
    });


    newEvent.author = author;
    if (req.body.categories) { // Verificar si se especificó una categoría
      const category = req.body.categories;
      await Category.find({ type: { $in: category } });
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
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
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

exports.deleteEvent = async (req, res) => {
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

exports.getEventAuthor = async (req, res) => {
  const { author } = req.params.id;

  try {
    const foundAuthor = await User.findOne({ id: author });

    if (!foundAuthor) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const foundEvents = await Event.find({ author: foundAuthor._id });

    return res.status(200).json(foundEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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