var express = require("express");
var createError = require("http-errors");
var cors = require("cors");
var logger = require("morgan");
var authRouter = require("./routes/token");
var charactersRouter = require("./routes/characters");
var audiovisualRouter = require("./routes/audiovisual");
//swagger
var swaggerUi = require("swagger-ui-express");
var swaggerjsDoc = require("swagger-jsdoc");
var path = require("path");
const multer = require("multer");

const service = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "test Node.js",
      version: "1.0.0",
      description: "This is a test CRUD API",
      contact: {
        name: "santiago",
        email: "santiagog2142@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    path.join(__dirname, "./routes/token.js"),
    path.join(__dirname, "./routes/characters.js"),
    path.join(__dirname, "./routes/audiovisual.js"),
    
  ],
};

// settings
service.set("port", process.env.PORT || 3000);

// middlewares
service.use(logger("dev"));
service.use(express.json());


const specs = swaggerjsDoc(options);
service.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// routes
service.use("/api/v1/disney-management/auth", authRouter);
service.use("/api/v1/disney-management/characters", charactersRouter);
service.use("/api/v1/disney-management/audiovisuals", audiovisualRouter);

//? Error handlers
service.use(logErrors);
service.use(clientErrorHandler);
service.use(errorHandler);

//--- might write request and error information to stderr
function logErrors(err, req, res, next) {
  if (err.status == 409) {
    console.log("Business Logic: " + err.message);
    return res.status(err.status).send(err.message);
  }
  /*else {
    console.log("System Error: " + err.message);
  }*/
  next(err);
}

//? send message error to a client call.
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    if (err.status == 409) {
      return res.sendStatus(err.status);
    } else {
      return res.status(500).send({ error: "Something failed!" });
    }
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  console.log("Message: ", err.message);
  console.log(err.stack);
  return res.status(500).send({ error: "Something failed!" });
}

// starting the server
module.exports = service;
