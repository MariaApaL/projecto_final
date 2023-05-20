const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const name = Date.now() + '-image' + '-goingOut';
    const filename = name + '-' + file.originalname;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;