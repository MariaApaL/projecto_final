const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images')
    }
  ,
      filename: function(req, file, cb) {
        cb(null, req.params.id +  path.extname(file.originalname));
      }
    }); 

    const upload = multer({ storage: storage })
exports.upload = upload.single('file')