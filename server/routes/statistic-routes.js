
const controller = require("../controllers/statistic-controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

// ruta GET para obtener el promedio de eventos por usuario
app.get("/getUsersAvgEventCount", controller.getUsersAvgEventCount);

// ruta GET para obtener el promedio de reportes por usuario
app.get("/getAverageReportsPerUser", controller.getAverageReportsPerUser);

// ruta GET para obtener el promedio de participantes por evento
app.get("/getAvgParticipants", controller.getAvgParticipants);










}
