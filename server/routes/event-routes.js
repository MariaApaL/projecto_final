const {  verifyEvent } = require("../middlewares");
const controller = require("../controllers/event-controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
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
  
 // Ruta get para obtener todos los eventos de la base de datos

 app.get("/getEvents", controller.getEvents);

// Ruta get para obtener un evento por su id 
   app.get("/getEvent/:id", controller.getEvent);

 // ruta POST para actualizar un event

 app.put("/updateEvent/:id", controller.updateEvent);

   // ruta DELETE para eliminar un event

 app.delete("/deleteByEventId/:id", controller.deleteByEventId);

 app.delete("/deleteEventByNameAndAuthor", controller.deleteEventByNameAndAuthor);


  // ruta GET para obtener evento por category

 app.get("/getEventCategory/:category",controller.getEventCategory);

   // ruta GET para obtener eventos por fecha

  app.get("/getEventDate",controller.getEventDate);

   //ruta GET para obtener eventos por lugar

    app.get("/getEventPlace",controller.getEventPlace);

   //ruta GET para obtener eventos por autor
   app.get("/findEventsByAuthorId/:id",controller.findEventsByAuthorId);

      //ruta GET para obtener eventos según palabras buscadas en nombre o descripcion
    app.get("/getEventWords",controller.getEventWords);

    //ruta GET para obtener eventos según precio
    
    app.get("/getEventPrice",controller.getEventPrice);

};