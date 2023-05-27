const db = require("../models");
const User = db.user;
const Message = db.message;


exports.send = async (req, res) => {
  try {
    const { transmitter, receiver, text } = req.body;

    // Buscar el mensaje existente
    const existingMessage = await Message.findOne({ transmitter, receiver });

    if (existingMessage) {
      // Agregar el nuevo texto al array existente
      existingMessage.text.push(text);
      await existingMessage.save();
    } else {
      // Crear un nuevo mensaje con el texto
      const newMessage = new Message({
        text: [text],
        transmitter,
        receiver
      });
      await newMessage.save();
    }

    // Actualizar el usuario emisor con el ID del mensaje
    const user = await User.findById(transmitter);
    user.messages.push(existingMessage ? existingMessage._id : newMessage._id);
    await user.save();

    res.status(200).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al enviar el mensaje', error: error });
  }
};

  exports.deleteAllMessages = async (req, res) => {
    try {
      const { transmitterId, receiverId } = req.params;
  
      const deletedMessages = await Message.findOneAndUpdate(
        { transmitter: transmitterId, receiver: receiverId },
        { $set: { text: [] } },
        { new: true }
      );
  
      // Buscar y actualizar el usuario transmisor
      const user = await User.findByIdAndUpdate(
        transmitterId,
        { $set: { messages: deletedMessages._id } },
        { new: true }
      );
  
      res.status(200).json({ message: 'Mensajes eliminados correctamente', deletedMessages: deletedMessages });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar los mensajes', error: error });
    }
  };


  exports.getAllMessage = async (req, res) => {
    try {
      const { transmitterId, receiverId } = req.params;
  
      const mensajes = await Message.find({ transmitter: transmitterId, receiver: receiverId });
  
      res.status(200).json(mensajes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los mensajes', error: error });
    }
  };

  exports.getMessageByTransmitter = async (req, res) => {
    try {
      const transmitterId = req.params.transmitterId;
  
      const mensajes = await Message.find({ transmitter: transmitterId });
  
      res.status(200).json(mensajes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los mensajes', error: error });
    }
  };