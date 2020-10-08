const {Worker, parentPort, workerData} = require('worker_threads');
const fetch = require('node-fetch');


// Obtenemos una partición de las peticiones
const requests = workerData;
// Obtenemos la función de isAlpha
const functions = require('./auxiliar_algorithms.js');
const isAlpha = functions.isAlpha;

const requestData = async function(params){
  // Conectamos a la api, conseguimos las peticiones y esas peticiones se guardarán en result
  try{
    const res = await fetch(params.server, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params.data)
    }).then((response) => response.json()).then((json) => parentPort.postMessage(json));
  }catch(err){
      console.log("Error fetching data", err);
  }
}

// Mandamos a llamar a la función
requestData(requests);
