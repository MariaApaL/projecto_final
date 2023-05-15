//para subir fotos a cloudinary 'npm i cloudinary'
const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dgm7hnxh9",
  api_key: "294499935895621",
  api_secret: "Y4fiYXs9UES5gBvpe2guASZzkGM"
});

module.exports = cloudinary;