const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images')
    }
  ,
      filename: function(req, file, cb) {
        cb(null, Date.now() +  path.extname(file.originalname));
      }
    }); 

    
exports.upload = multer({ storage: storage })