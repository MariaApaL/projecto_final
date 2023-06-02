const { verifyEvent, upload } = require("../middlewares");
const controller = require("../controllers/event-controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //   Ruta POST para el registro de eventos. Se pasa como argumento a esta ruta 
  //   un array de middlewares de "verifyEvent" que se utilizan para verificar 
  //   si el evento existe en la base de datos. 


  app.post(
    "/createEvent",
    [
      verifyEvent.checkIfEventExists,

    ],
    controller.createEvent
  );

  app.post('/uploadEventPhoto/:id', upload.single('picture') , controller.uploadEventPhoto);

  
  // Ruta get para obtener todos los eventos de la base de datos

  app.get("/getEvents", controller.getEvents);

  // Ruta get para obtener un evento por su id 
  app.get("/getEvent/:id", controller.getEvent);

  // ruta PUT para actualizar un event



  app.put("/updateEvent/:id", controller.updateEvent);

  // ruta DELETE para eliminar un event

  app.delete("/deleteByEventId/:id", controller.deleteByEventId);

  app.delete("/deleteEventByIdAndAuthor", controller.deleteEventByIdAndAuthor);

  app.delete("/deleteEventsByAuthor/:id", controller.deleteEventsByAuthor);

  //ruta GET para obtener eventos por autor
  app.get("/findEventsByAuthorId/:id", controller.findEventsByAuthorId);


  //PLAZAS

  app.post('/addParticipant/:id', controller.addParticipant);

  app.delete("/deleteParticipant/:id", controller.deleteParticipant);

  app.get("/getParticipants/:id", controller.getParticipants);

  app.get("/getEventsByParticipantId/:id", controller.getEventsByParticipantId);

  app.delete("/deleteUserPlazas/:id", controller.deleteUserPlazas);


 //VALORACIONES
 app.post("/addValuation/:id", controller.addValuation);

//Obtener valoraciones de un evento
 app.get("/getEventValuations/:id", controller.getEventValuations);

//Obtener valoraciones de un evento de un usuario
 app.get("/getEventValuationsByAuthor/:eventId/:authorId", controller.getEventValuationsByAuthor);

 //Obtener valoraciones de un usuario (las que le han puesto a sus eventos)
 app.get("/getValuationsByAuthor/:authorId", controller.getValuationsByAuthor);
 
 app.delete("/deleteUserValuation/:userId/:valuationId", controller.deleteUserValuation);
app.delete("/deleteUserValuations/:id", controller.deleteUserValuations);

};