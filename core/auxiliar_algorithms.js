// Documento para los algoritmos auxiliares o frecuentemente utilizados
const converter = require('json-2-csv');
const fs = require('fs');

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

// Función que normaliza las cadenas
const normalizar = (texto) => {
  var str = texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase();
  return str.replace(/[^\w\s]/gi, '');
}

// Función para sleep en Javascript
const sleep =(ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Función que genera un csv de cuerdo a un json
const convert_to_csv = (lista, nombre_archivo) =>{
  converter.json2csv(lista, (err, csv) => {
    if (err) {
        throw err;
    }
    // write CSV to a file
    fs.writeFileSync(nombre_archivo, csv);
  });
}

module.exports.isAlpha = isAlpha;
module.exports.partition_data = partition_data;
module.exports.sleep = sleep;
module.exports.normalizar = normalizar;
module.exports.convert_to_csv = convert_to_csv;
