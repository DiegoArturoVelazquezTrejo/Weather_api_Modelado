const {Worker, parentPort, workerData} = require('worker_threads');
const fetch = require('node-fetch');


// Obtenemos una partición de las peticiones
const requests = workerData;

// request -> [reques1, request2, request3, request4, ..., requestn]
// [http://api.openweathermap.org/data/2.5/weather?q=Monterrey&appid=3135e334d6fbed99649f285eb30e30aa,
//  http://api.openweathermap.org/data/2.5/weather?q=Cancun&appid=3135e334d6fbed99649f285eb30e30aa,
//  ...,
//  http://api.openweathermap.org/data/2.5/weather?q=Veracruz&appid=3135e334d6fbed99649f285eb30e30aa]

const requestData = async function(request) =>{
  var url = '';
  var origin = '';
  var url_city, url_coord;
  const result = {};
  // Conectamos a la api, conseguimos las peticiones y esas peticiones se guardarán en result
  for(var key in info_tickets){
    // 1. Tenemos que ver si la clave cumple con isAlpha, si es así, hacemos la petición con ella
    if(isAlpha(key)){
      url_city = `api.openweathermap.org/data/2.5/weather?q=${key}&appid=3135e334d6fbed99649f285eb30e30aa`;
      // Respuestas de la API
      var respuesta = await fetch (url_city)
      var response = await respuesta.json();
      // Si la respuesta es NULL, intentamos con las coordenadas 
      result[key] = response; // Ya después especificamos que datos queremos de la respuesta de la api
    }else{
      url_coord = `api.openweathermap.org/data/2.5/weather?lat=${info_tickets["latitude"]}&lon=${info_tickets["longitude"]}&appid=3135e334d6fbed99649f285eb30e30aa`;
      // Respuestas de la API
      var respuesta = await fetch (url_coord)
      var response = await respuesta.json();
      result[key] = response; // Ya después especificamos que datos queremos de la respuesta de la api
    }
  }
  // Regresamos el resultado
  parentPort.postMessage(result);
}

// Función para verificar que las claves de las ciudades tengan únicamente caracteres alfabéticos
var isAlpha = function(ch){
  return (ch.match(/[0-9]/) == null);
}

// Mandamos a llamar a la función
requestData(requests);
