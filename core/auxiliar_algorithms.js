// Documento para los algoritmos auxiliares o frecuentemente utilizados

// Función para verificar que las claves de las ciudades tengan únicamente caracteres alfabéticos
const isAlpha = function(ch){
  return (ch.match(/[0-9]/) == null);
}

// Función para particionar los datos de acuerdo a la cantidad de CPUs (para los hilos)
const partition_data = function(data_to_be_resolved, servers){
  // sub sub partición que la información que cada hilo va a procesar
  const segmentSize = 55;
  let contador = 0;
  let counter = 0;
  let data = {};
  let data_server = {};
  const segments = [];
  // Hacemos un arreglo con particiones de datos para cada worker (hilo)
  for(var key in data_to_be_resolved){
    if(contador < segmentSize){
      data[key] = data_to_be_resolved[key];
      contador++;
    }else{
      data_server["data"] = data;
      data_server["server"] = servers[counter];
      segments.push(data_server);
      contador = 1;
      counter++;
      data = {};
      data_server = {};
      data[key] = data_to_be_resolved[key];
    }
  }
  if(Object.keys(data).length >0){
    data_server["data"] = data;
    data_server["server"] = servers[counter];
    segments.push(data_server);
  }
  return segments;
}

// Función para sleep en Javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función que normaliza las cadenas
function normalizar(texto) {
    var str = texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase();
    return str.replace(/[^\w\s]/gi, '');
}

module.exports.isAlpha = isAlpha;
module.exports.partition_data = partition_data;
module.exports.sleep = sleep;
module.exports.normalizar = normalizar;
