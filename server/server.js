const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");
const Category = require("./models/category-model");
const Role = db.role;
const path = require('path');
const router = express.Router();
require('dotenv').config();
// const db_user = process.env.db_user;
// const db_pass = process.env.db_pass;

let corsOptions = {
  origin: true,
  credential:true
};

app.use(cors(corsOptions));


// indica a la aplicación que debe analizar las solicitudes 
// entrantes con formato JSON

app.use(express.json());

// indica a la aplicación que debe analizar las solicitudes 
// entrantes con formato URL codificado y hacer que los datos 
// estén disponibles en el objeto "req.body".

app.use(express.urlencoded({ extended: true }));


app.get("/user", (req, res) => {
  res.json({ message: "Aplicación lanzada." });
});


//multer
app.use(router);

router.get('/images/:filename', (req,res)=>{
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '/images', filename);
  res.sendFile(imagePath);
})

require('./routes/user-routes')(app);
require('./routes/event-routes')(app);
require('./routes/category-routes')(app);
// require('./routes/img-routes')(app);



const PORT = process.env.PORT || 3301;
app.listen(PORT, () => {
  console.log(`Servidor corriendo por el puerto ${PORT}.`);
});


(async function() {
  try {
    await db.mongoose.connect('mongodb+srv://root:root@project.s4gvf6v.mongodb.net/?retryWrites=true&w=majority');
    console.log("Successfully connect to MongoDB.");
    await initial();
    await initialCategories();
  } catch (err) {
    console.error("Connection error", err);
    process.exit();
  }
})();

  //La función 'initial' verifica si la colección 
    // de roles vacía en MongoDB. Si está vacía, 
    // crea y guarda los roles en caso de que no haya ningún
    //  rol en la base de datos.

    async function initial() {
      try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
          await Promise.all([
            new Role({ name: "user" }).save(),
            new Role({ name: "admin" }).save()
          ]);
          console.log("Roles agregados correctamente.");
        }
      } catch (err) {
        console.error("Error al agregar roles", err);
      }
    }

    async function initialCategories() {
      try {
        const count = await Category.estimatedDocumentCount();
        if (count === 0) {
          await Promise.all([
           
            new Category({ type: "cultura" }).save(),
            new Category({ type: "deportes" }).save(),
            new Category({ type: "gastronomia" }).save(),
            new Category({ type: "animales" }).save(),
            new Category({ type: "solidario" }).save(),
          ]);
          console.log("Categorias agregadas correctamente.");
        }
      } catch (err) {
        console.error("Error al agregar categorias", err);
      }
    }