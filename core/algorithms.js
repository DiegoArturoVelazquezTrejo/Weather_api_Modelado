// Este archivo se encargará de conectarse con las APIS, hacer los Threads.
const fetch = require('node-fetch');
const os = require('os');
const path = require('path');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');
const ora = require('ora');

// Información para los workers
const userCPUCount = os.cpus().length;
const workerPath = path.resolve('api_request_worker.js');


// Esta es la función que regresará el diccionario con los climas
const get_weather_status = (info_tickets) =>{

  // Paso 1: Dividir la caché entre tres listas, una la analizaremos nosotros y las otras 2 las analizarán los servidores
  var division = Math.ceil(Object.keys(info_tickets).length/3);
  var partition_1 = {};
  var partition_2 = {};
  var partition_3 = {};
  let contador = 0;
  for(var key in info_tickets){
    /*
    * Podemos checar si la API acepta la clave, si no la acepta, no la metemos
    *
    *
    *
    */
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

  //---------------------------------------------------------------------------------------------------
  // Alternativa 1: Conectarnos a los microservidores para pasarles los datos (si no se logra la conexión, nosotros tendremos que hacer las peticiones)
      /*
        1. Hacer la petición a la API (microServer) pasándole una parte del caché
        2. Recibimos la respuesta
          2.1 Si sí se logró, se incorpora a la respuesta
          2.2 Si no se logró, hacemos nosotros también esas peticiones
      */
  //---------------------------------------------------------------------------------------------------

  // Vamos a particionar la partición que nosotros trabajaremos
  const segmentSize = Math.ceil(Object.keys(partition_1).length)/userCPUCount;
  //[{particion_1.1}, {particion_1.2}, {particion_1.3}] (necesitamos producir algo así)
  contador = 0;
  let data = {};
  const segments = [];
  // Hacemos un arreglo con particiones de datos para cada worker (hilo)
  for(var key in partition_1){
    if(contador < segmentSize){
      data[key] = partition_1[key];
      contador++;
    }else{
      segments.push(data);
      contador = 1;
      data = {};
      data[key] = partition_1[key];
    }
  }
  if(Object.keys(data).length >0){
    segments.push(data);
  }
  // Vamos a trabajar con los workers
  var promises = segments.map(
    segment =>
      new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
          workerData: segment,
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      })
  );

  const partition_1_results =  Promise.all(promises).then(results => {
    // Aquí tendríamos las respuestas de los climas para cada segmento de la partición 1
    return results;
  });

  // Nos falta unirlas con las respuestas de las 2 APIS

  return; // Todas las predicciones
}

module.exports.get_weather_status = get_weather_status;
