const controller = require("../controllers/message-controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/getAllMessage/:transmitterId/:receiverId ", controller.getAllMessage );

    app.post("/send", controller.send);

    app.delete("/deleteAllMessages/:transmitterId/:receiverId", controller.deleteAllMessages);

    app.get("/getMessageByTransmitter/:transmitterId", controller.getMessageByTransmitter);

}

