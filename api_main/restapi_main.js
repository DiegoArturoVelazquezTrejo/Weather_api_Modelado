var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();

const bodyParser = require("body-parser");
const database = require('../database/database.js');

// Importar el archivo con los endpoints
const Endpoints = require('../endpoints/endpoints');

// express configuration here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('dotenv').config();

// Puerto en el que el servidor trabajará
const REST_API_PORT = 2727;

// Endpoint de subir csv
app.post("/subirNombreCSV", Endpoints.weatherEndpoint);


// Aquí estamos creando al servidor
var httpServer = http.createServer(app);
httpServer.listen(REST_API_PORT);

// Verificar el puerto en el que el servidor está trabajando
console.log("rest api serving on http://localhost:"+  REST_API_PORT);
