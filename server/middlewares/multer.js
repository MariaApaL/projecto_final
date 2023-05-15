//para subir imagenes 
const multer = require('multer');


const multerStorage = multer.diskStorage({


  filename: function (req, file, cb) {
    //nombre con el que guardamos 
    const picName = Date.now() + '-' + 'gOut' + '-' + file.originalname;
    const filename = picName + '-' + file.originalname;
    cb(null, filename);
  }
});

// Siempre tiene que ser ese tamaño para mejor rendimiento
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
})

module.exports = upload;