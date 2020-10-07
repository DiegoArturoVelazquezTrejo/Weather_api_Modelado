const {Worker, parentPort, workerData} = require('worker_threads');
const fetch = require('node-fetch');


// Obtenemos una partición de las peticiones
const requests = workerData;
// Obtenemos la función de isAlpha
const functions = require('./auxiliar_algorithms.js');
const isAlpha = functions.isAlpha;

const requestData = async function(params){
  // Conectamos a la api, conseguimos las peticiones y esas peticiones se guardarán en result
  const promise = await fetch(params.server,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params.data),
        cache: 'no-cache',
        timeout: 200000
    }).then(function(response) {
        // Regresamos el resultado
        parentPort.postMessage(response.json());
        return;
    })
    .catch(function(err) {
      console.log(err); 
  });
}

// Mandamos a llamar a la función
requestData(requests);
