// Este archivo se encargará de conectarse con las APIS, hacer los Threads.
const fetch = require('node-fetch');

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


// Esta es la función que regresará el diccionario con los climas
const get_weather_status = async(info_tickets) =>{

  // Esto es en el caso que la longitud de info_tickets sea menor a 60
  data_to_be_resolved = {};
  if(Object.keys(info_tickets).length < 60){
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
    data_to_be_resolved = partition_1; // La que nosotros trabajaremos
  }
  // Conexión con los dos microservidores

  //----------------------------------------------------------


  // Vamos a sub-particionar la partición que nosotros trabajaremos data_to_be_resolved
  // Necesitamos que cada partición del data_to_be_resolved tenga exactamente 60/#Cpus para que así, la suma de peticiones que hagan los hilos de 59

  // Si la longitud de data_to_be_resolved es menor a 60, no hacemos nada y lo pasamos directo a los hilos
  // Si la longitud es mayor, aquí tenemos que volver a subparticionar en grupos de 55 a lo más, tendríamos que esperarnos un minuto por cada partición que tengamos.

  // data_to_be_resolved = {pet1, pet2, ..., pet75}
  const partitions_array = [];
  if(Object.keys(data_to_be_resolved).length < 55){
    partitions_array.push(data_to_be_resolved)
  }else{
    // [{subpart1}, {subpart2}, ..., {subpartn}] en donde cada subparticion va a tener a lo más 55 elementos  (tenemos que regresar algo así)
    var object = {};
    var limit = 55;
    let counter = 0;
    for(var key in data_to_be_resolved){
      if(counter < limit){
        object[key] = data_to_be_resolved[key];
        counter++;
      }else{
        partitions_array.push(object);
        object={};
        counter = 1;
        object[key] = data_to_be_resolved[key];
      }
    }
    if(Object.keys(object).length > 0){
      partitions_array.push(object);
    }
  }

  console.log("Solicitando información...");
  var beg = Date.now();

  // Vamos a trabajar con nuestra partición ...
  var beginig, end, difference;
  var segments = [];
  // Arreglo de promesas que contenga todos los resultados de todos los hilos de todas las peticiones de todas las particiones
  var result_promises = [];
  for(var i = 0; i < partitions_array.length; i++){
    // sub sub partición que la información que cada hilo va a procesar
    segments = partition_data(partitions_array[i]);

    beginig = Date.now();
    // Vamos a trabajar con los workers (hilos)
    partition_results = Workers.worker(segments);
    end = Date.now();
    difference = (end - beginig);
    // Esperamos el tiempo restante para juntar 1 minuto de peticiones a la API
    if(partitions_array.length>1 && i < partitions_array.length-1)
      await sleep(65000 - difference);  // HACER LA PREGUNTA DE QUE SI ESE SLEEP ES PARA TODO EL PROGRAMA O PARA EL HILO EN EL QUE SE ESTÁ TRABAJANDO

    // Agregamos el resultado a la lista de promesas
    result_promises.push(partition_results)
  }

  console.log("Proceso finalizado...");
  var endi = Date.now();
  diffinal = (endi - beg)/1000;
  console.log("El sistemá tardó:   " +diffinal+ "   segundos en realizar las peticiones. ");


  // Nos falta unirlas con las respuestas de los dos microservidores

  return Promise.all(result_promises).then(results => {
    // Concatenar todos los resultados de todas las promesas
    console.log("-----------------------------------------------------------");
    console.log(results);
    console.log("-----------------------------------------------------------");
  });
}

module.exports.get_weather_status = get_weather_status;
