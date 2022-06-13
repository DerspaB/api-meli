require("dotenv").config();
const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.itemsPath = "/api/items";

    // llamo los Middlewares son funciones que siempre se ejecutaran al inicar el servidor
    this.middlewares();

    // ejecuto la funcion para obtener las diferentes rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    // agrego las diferentes rutas que tendra mi aplicacion
    this.app.use(this.itemsPath, require("../routes/items"));
  }

  listen() {
    // esta funcion ponda el servidor a funcionar en un respectivo puerto de la maquina en este caso el indicado en las variables de entorno
    this.app.listen(this.port, () => {
      console.log(`This app is listening in the port ${this.port}`);
    });
  }
}

module.exports = Server;
