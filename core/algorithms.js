// Este archivo se encargará de conectarse con las APIS, hacer los Threads.
const fetch = require('node-fetch');
const os = require('os');

// Obtenemos el json con las claves IATA de aeropuertos en México
const claves = require('../resources/ClavesAeropuertosMexGeneralizadas.js');
const clavesIATAmex = claves.clavesIATAmex;

// Vamos a requerir la función que trabaja con los workers
const Workers = require('./workers.js');

// Información para los workers
const userCPUCount = os.cpus().length;


// Esta es la función que regresará el diccionario con los climas
const get_weather_status = (info_tickets) =>{

  // Esto es en el caso que la longitud de info_tickets sea menor a 60
  data_to_be_resolved = {};
  if(Object.keys(info_tickets).length <= 60){
    data_to_be_resolved = info_tickets
  }else{
    // Vamos a particionar los datos y a conectarnos a microservidores para tratar paralelamente las peticiones
    var division = Math.ceil(Object.keys(info_tickets).length/3);
    var partition_1 = {};
    var partition_2 = {};
    var partition_3 = {};
    let contador = 0;
    for(var key in info_tickets){
      if(contador < division){
        partition_1[key] = info_tickets[key];
      }
      if(contador >= division && contador < division*2){
        partition_2[key] = info_tickets[key];
      }
      if(contador >= division*2 && contador < division*3){
        partition_3[key] = info_tickets[key];
      }
      contador++;
    }
    data_to_be_resolved = partition_1;
  }
  // Vamos a sub-particionar la partición que nosotros trabajaremos data_to_be_resolved
  // Necesitamos que cada partición del data_to_be_resolved tenga exactamente 60/#Cpus para que así, la suma de peticiones que hagan los hilos de 59

  // Si la longitud de data_to_be_resolved es menor a 60, no hacemos nada y lo pasamos directo a los hilos
  // Si la longitud es mayor, aquí tenemos que volver a subparticionar en grupos de 55 a lo más, tendríamos que esperarnos un minuto por cada partición que tengamos.


  const segmentSize = Math.ceil(Object.keys(data_to_be_resolved).length)/userCPUCount;
  contador = 0;
  let data = {};
  const segments = [];
  // Hacemos un arreglo con particiones de datos para cada worker (hilo)
  for(var key in data_to_be_resolved){
    if(contador < segmentSize){
      data[key] = data_to_be_resolved[key];
      contador++;
    }else{
      segments.push(data);
      contador = 1;
      data = {};
      data[key] = data_to_be_resolved[key];
    }
  }
  if(Object.keys(data).length >0){
    segments.push(data);
  }

  // Vamos a trabajar con los workers (hilos)
  partition_1_results = Workers.worker(segments);


  partition_1_results.then(results =>{
    console.log("Hola! Soy la promesa nueva");
    console.log(results);
  });
  // Nos falta unirlas con las respuestas de las 2 APIS
  return; // Todas las predicciones
}

module.exports.get_weather_status = get_weather_status;
