// Este archivo se encargará de conectarse con las APIS, hacer los Threads.

// Obtenemos el json con las claves IATA de aeropuertos en México
const claves = require('../resources/ClavesAeropuertosMexGeneralizadas.js');
const clavesIATAmex = claves.clavesIATAmex;

// Vamos a requerir la función que trabaja con los workers
const Workers = require('./workers.js');
// Vamos a requerir la función para particionar los datos
const functions = require('./auxiliar_algorithms.js');
const partition_data= functions.partition_data;
const sleep = functions.sleep;


require('events').EventEmitter.defaultMaxListeners = 15;

// Microservidores a nuestra disposición
const Servers = require('../resources/servidores.js');
const servers = Servers.servers;

// Esta es la función que regresará el diccionario con los climas
const get_weather_status = async(info_tickets) =>{

  // Esto es en el caso que la longitud de info_tickets sea menor a 60
  data_to_be_resolved = [];
  if(Object.keys(info_tickets).length < 60){
    data_to_be_resolved.push(info_tickets);
  }else{
    // Vamos a particionar los datos y a conectarnos a microservidores para tratar paralelamente las peticiones (sabemos que el límite es 1100)
    var division = Math.ceil(Object.keys(info_tickets).length/2);
    var partition_1 = {};
    var partition_2 = {};
    let contador = 0;
    for(var key in info_tickets){
      if(contador < division){
        partition_1[key] = info_tickets[key];
      }
      if(contador >= division && contador < division*2){
        partition_2[key] = info_tickets[key];
      }
      contador++;
    }
    data_to_be_resolved.push(partition_1);
    data_to_be_resolved.push(partition_2);
  }

  //----------------------------------------------------------
  // Conexión a nuestros microservidores para analizar las particiones restantes
  console.log("Solicitando información...");
  var beg = Date.now();

  // Vamos a trabajar con nuestra partición ...
  var beginig, end, difference;
  // Arreglo de promesas que contenga todos los resultados de todos los hilos de todas las peticiones de todas las particiones
  var result_promises = [];

  for(var i = 0; i < data_to_be_resolved.length; i++){
    // sub sub partición que la información que cada hilo va a procesar (cada partición tendrá sus 55 elementos y su dirección de servidor)
    segments = partition_data(data_to_be_resolved[i], servers);

    beginig = Date.now();
    // Vamos a trabajar con los workers (hilos)
    //partition_results = Workers.worker(segments);
    end = Date.now();
    difference = (end - beginig);
    // Esperamos el tiempo restante para juntar 1 minuto de peticiones a la API
    if(data_to_be_resolved.length>1 && i < data_to_be_resolved.length-1)
      await sleep(63000 - difference);

    // Agregamos el resultado a la lista de promesas
    result_promises.push(partition_results)
  }

  console.log("Proceso finalizado...");
  console.log("El sistemá tardó:   " +(Date.now() - beg)/1000+ "   segundos en realizar las peticiones. ");

  return Promise.all(result_promises).then(results => {
    // Concatenar todos los resultados de todas las promesas
    json_result = {};
    // Vamos a iterar sobre los resultados, es una lista con jsons, entonces vamos a concatenar todo a un solo json para enviar ese json como respuesta
    for(var i= 0; i < results.length; i++){
      for(var key in results[i]){
        json_result[key] = results[i][key];
      }
    }
    return json_result;
  });
}

module.exports.get_weather_status = get_weather_status;
