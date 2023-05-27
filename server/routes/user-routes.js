const { verifySignUp, authJwt } = require("../middlewares");
const  { upload } = require("../middlewares");
const controller = require("../controllers/user-controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

//   Ruta POST para el registro de usuarios. Se pasa como argumento a esta ruta 
//   un array de middlewares de "verifySignUp" que se utilizan para verificar 
//   si el email o usuario ya existen y si los roles especificados
//   existen en la base de datos. 


  app.post(
    "/register",
    [
      verifySignUp.checkIfEmailOrUserExists,
      verifySignUp.checkRolesExists
    ],
    controller.signup
  );
  
// ruta POST para el inicio de sesión. Se llama directamente a la función "login" 
// del controlador "user-controller" para autenticar al usuario.

  app.post("/login", controller.login);

  // ruta PUT para actualizar un usuario

  // upload.single('file'),
  app.put("/updateUser/:id", controller.updateUser);


  app.post("/uploadUserPhoto/:id", upload.single('picture'), controller.uploadUserPhoto);
  // ruta DELETE para eliminar un usuario

  app.delete("/deleteUser", controller.deleteUser);

  // ruta GET para obtener todos los usuarios

  app.get("/getAll",controller.getUsers);

  // ruta GET para obtener un usuario por su nombre o email

  app.get("/getUser", controller.getUser);

  app.get("/getUserByEventId/:id", controller.getUserByEventId);

  // ruta GET para obtener un usuario por su id
  app.get("/getUserById/:id", controller.getUserById);

  //Agregar a favoritos.
  app.post('/setFavorite/:id', controller.setFavorite);
  //Obtener favoritos.
  app.get("/getFavorites/:id", controller.getFavorites);
  //Eliminar de favoritos.
  app.delete("/deleteFavorite/:id", controller.deleteFavorite);

 //resetear contraseña
 app.post("/forgotPassword", controller.forgotPassword);


};