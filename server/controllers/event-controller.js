
const palabrasProhibidas = require("../config/badword")
const moment = require('moment')
const db = require("../models");
const User = db.user;
const Event = db.event;


exports.createEvent = async (req, res) => {
    try {
      const { name, date, location, author, picture, numPlazas, description } = req.body;
        name.toLowerCase();
        description.toLowerCase();
    
      // Comprobar si el usuario existe
      const existingAuthor = await User.findOne({_id: author});
      if (!existingAuthor) {
        return res.status(400).send({ message: "Error, el usuario especificado no existe" });
      }

      // Comprobar si contiene palabras prohibidas
      for (let i = 0; i < palabrasProhibidas.length; i++) {
        if (name.toUpperCase().includes(palabrasProhibidas[i].toLocaleUpperCase()) ||
          description.includes(palabrasProhibidas[i].toLocaleUpperCase()))
          return res.status(400).send({ message: "Error, palabras prohibidas" });
      }
      const moment = require("moment");

const newDate = moment(date, "DD-MM-YYYY").toDate();
      const newEvent = new Event({
        name: name,
        date: newDate,
        location: location,
        picture:picture,
        author: existingAuthor,
        numPlazas:numPlazas,
        description:description,
      });

      newEvent.author = author;
      await newEvent.save();
      res.send({ message: "¡Evento creado exitosamente!", event: newEvent });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };