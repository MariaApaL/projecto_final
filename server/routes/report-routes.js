const controller = require("../controllers/report-controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/getReports", controller.getReports);

  app.getReportById("/getReportById/:id", controller.getReportById);

 //agregar reporte 

 app.post("/addReport/:id", controller.addReport);

 //obtener reportes por tipo
 app.get("/getReportsByType/:id/:reportType", controller.getReportsByType);

//borrar por id de eventos:
app.delete("/deleteReportsByEventId/:id", controller.deleteReportsByEventId);
 
}
