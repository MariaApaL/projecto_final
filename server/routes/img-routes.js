const { } = require("../middlewares");
const controller = require("../controllers/img-controller");
const { upload } = require("../middlewares/multer");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
}

//en upload.single('file') se especifica el nombre del campo del formulario que se va a subir
app.put("/uploadUserImg/:id",  upload, controller.uploadUserImg);

app.put("/uploadEventImg/:id", upload, controller.uploadEventImg);