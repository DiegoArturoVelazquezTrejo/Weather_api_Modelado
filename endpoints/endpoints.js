const fs = require('fs');
const csv = require('csv-parser');

// Importar la función que utilizaremos para obtener los climas
const Algorithms = require('../core/algorithms');

// Importamos el json de las claves ISO para aeorpuertos en méxico
const claves = require('../resources/ClavesAeropuertosMexGeneralizadas.js');
const clavesIATAmex = claves.clavesIATAmex;

// Obtenemos la función de isAlpha
const functions = require('../core/auxiliar_algorithms.js');
const isAlpha = functions.isAlpha;
const normalizar = functions.normalizar;
const convert_to_csv = functions.convert_to_csv;

// Este el el archivo que contiene los endpoints
const weatherEndpoint = async(req, res)=>{

  // Verificar que los parámetros sean los que necesitamos
  // Declaramos las estructuras de datos
  const unique_tickets = {};
  const tickets = [];
  // Contador para identificar los boletos que estén mal
  var counter = 1;
  // Lista que contiene los números de tickets erróneos
  const error_tickets = 0;

  // El sistema analizará únicamente hasta 1,100 peticiones
  const limit_unique_cities = 1100;
  var limit_counter = 0;

  // Leemos los datos
  fs.createReadStream('./resources/datosModelado2.csv').pipe(csv())
    .on('data', (row) => {
      // Vamos a ver que tipo de base de datos nos están pasando (Tipo 1 y Tipo 2)

      if(((row.origin && isAlpha(row.origin)) || (row.origin_latitude && row.origin_longitude)) && ((row.destination && isAlpha(row.destination)) || (row.destination_latitude && row.destination_longitude))  && (limit_counter < limit_unique_cities) ){
      // CASO BASE DE DATOS 1 (origin	destination	origin_latitude	origin_longitude	destination_latitude	destination_longitude)
            // Obtenemos la información únicamente del destino (porque es lo nos importa)
            ticket = {}
            if(row.destination){
              ticket["latitude"] = row.destination_latitude;
              ticket["longitude"] = row.destination_longitude;
            }else{
              ticket["latitude"] = row.destination_latitude;
              ticket["longitude"] = row.destination_longitude;
            }
            var key = '';
            if(row.destination && isAlpha(row.destination) && (row.destination in clavesIATAmex)){
              // Vamos a ver si esa clave está en nuestro json de claves IATA o no
              // Si no está la IATA en nuestro json, asumimos que no la conocemos; porque no está en la base de iatas para méxico que trabajamos. Por lo que utilizaremos las coordenadas para hacer la petición e intentar obtener una respuesta.
              key = clavesIATAmex[row.destination];
            }else{
              key = (row.destination_latitude + row.destination_longitude);
            }
            // Agregar a un diccionario (si se se repite, no se agrega) VALORES ÚNICOS (((Considerar 2 posibles tipos database)))
            if(!(key in unique_tickets)){
              unique_tickets[key] = ticket;
              limit_counter++;
            }
            // Agregar a lista (con todo y repeticiones ) TODOS LOS TICKETS
            tickets.push(row);
            // Aumentamos el contador
            counter++;
      }
      else if(row.destino && isAlpha(row.destino) && (limit_counter < limit_unique_cities)){
      // CASO BASE DE DATOS 2 (destino	salida	llegada	fecha de salida)
            // String del destino para que sea la clave
            var key = normalizar(row.destino);
            // Agregar a un diccionario (si se se repite, no se agrega) VALORES ÚNICOS (((Considerar 2 posibles tipos database)))
            if(!(key in unique_tickets)){
              unique_tickets[key] = key;
              limit_counter++;
            }
            // Agregar a lista (con todo y repeticiones ) TODOS LOS TICKETS
            tickets.push(key);
            // Aumentamos el contador
            counter++;
      }else if(limit_counter < limit_unique_cities){
        console.log("Error leyendo: \n"+JSON.stringify(row));
        // Esto significa que se encontró un boleto con información equivocada
        error_tickets++; // Para decirle al usuario "Tu boleto en esta posición # está mal, o tu boleto número # está mal"
        counter++;
      }
    })
    .on('end', () => {
            console.log("--------------------------------------");
            console.log("Tenemos "+Object.keys(unique_tickets).length+" vuelos a distintos lugares");
            console.log("Tenemos "+tickets.length+" boletos");
            console.log("Tenemos "+error_tickets+" boletos sin destino o sin origen (erróneos)");
            // Llamar método de core para hacer las peticiones a la API de lo que tengamos en el diccionario
            // Observación: unique_tickets ya tiene las claves ÚNICAS dentro de la base de datos. I.E. es nuestro Caché
            Algorithms.get_weather_status(unique_tickets).then(weathers => generate_report(weathers, tickets, res));
            // Método para concatenar climas y lugares y generar un JSON que se enviará al usuario
            console.log("--------------------------------------");
            // Si tenemos un ticket cuyo destino (clave) no está en las clavesIATAmex, entonces concatenamos su latitude+longitude y usamos ese como clave para obtener el resultado
  });
  return;
};

// Función que realiza el etiquetado  weathers: diccionario con los climas,   tickets: lista con los tickets
const generate_report = (weathers, tickets, res)=>{
  var listaRenglones = [];
  var columnaData = {};
  var destination;
  var achieved_requests  = 0;
  var failed_requests = 0;
  for(var i = 0; i < tickets.length; i++){
    if(tickets[i].destination || (tickets[i].destination_latitude && tickets[i].destination_latitude)){
        destination = (tickets[i].destination in clavesIATAmex) ? clavesIATAmex[tickets[i].destination] : tickets[i].destination_latitude+tickets[i].destination_longitude;
        clima = weathers[destination];
        if(clima != undefined){
          columnaData["Número de Ticket"] = i;
          columnaData["Status"] = "Petición completada";
          columnaData["Destino"] = destination;
          columnaData["Humedad"] = clima["humidity"];
          columnaData["Temperatura"] = clima["temp"];
          columnaData["Temperatura Minima"] = clima["temp_min"];
          columnaData["Temperatura Máxima"] = clima["temp_max"];
          columnaData["Presión Atmosférica"] = clima["humidity"];
          achieved_requests++;
        }else{
          columnaData["Número de Ticket"] = i;
          columnaData["Status"] = "Petición no completada";
          columnaData["Destino"] = destination;
          failed_requests++;
        }
        listaRenglones.push(columnaData);
        columnaData = {};
    }else if(tickets[i] != undefined){
        destination = tickets[i];
        clima = weathers[destination];
        if(clima != undefined){
          columnaData["Número de Ticket"] = i;
          columnaData["Status"] = "Petición completada";
          columnaData["Destino"] = destination;
          columnaData["Humedad"] = clima["humidity"];
          columnaData["Temperatura"] = clima["temp"];
          columnaData["Temperatura Minima"] = clima["temp_min"];
          columnaData["Temperatura Máxima"] = clima["temp_max"];
          columnaData["Presión Atmosférica"] = clima["humidity"];
          achieved_requests++;
        }else{
          columnaData["Status"] = "Petición no completada";
          columnaData["Número de Ticket"] = i;
          columnaData["Destino"] = destination;
          failed_requests++;
        }
        listaRenglones.push(columnaData);
        columnaData = {};
    }
  }
  console.log("--------------------------------------");
  console.log("\nNúmero de peticiones no logradas: "+failed_requests);
  console.log("Número de peticiones logradas: "+achieved_requests);
  console.log("Número de peticiones realizadas por el sistema: "+Object.keys(weathers).length);
  console.log("\n--------------------------------------");
  convert_to_csv(listaRenglones, "respuesta.csv");
  // Sending the data back
  res.setHeader('Content-Type', 'application/json');
  res.status(201).send(weathers);
}


// Exportar la función
module.exports.weatherEndpoint = weatherEndpoint;
