const Joi = require("joi");
require("dotenv").config({ debug: true });
var service = require("./src/service");
var debug = require("debug")("securityservice:server");
var http = require("http");
var port = normalizePort(process.env.PORT );

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production").required(),
  PORT: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  SECRET: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
}).options({
  allowUnknown: true,
  abortEarly: false,
});

// Valida el esquema de las variables de entorno
const { error } = schema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  console.error("Error in environment variables:", error.message);
  process.exit(1); // Salir de la aplicación con un código de error
}

service.set("port", port);
var server = http.createServer(service);
var models = require("./src/models");

models.sequelize
  .sync()
  .then(configureServer)
  .catch((err) => {
    console.log("Unable to connect to the database", err);
  });

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function configureServer() {
  server.listen(port, function () {
    console.log("BACKEND SERVICE");
    console.log("DB Context", process.env.DB_NAME);
    console.log("Security Service is running on port", port);
  });
  server.on("error", onError);
  server.on("listening", onListening);
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}