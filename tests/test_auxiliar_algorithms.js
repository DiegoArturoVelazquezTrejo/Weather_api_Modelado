// Documento de las pruebas unitarias
const functions = require('../core/auxiliar_algorithms.js');
const partition_data = functions.partition_data;
const serversData = require('../resources/servidores.js');
const servers = serversData.servers;
const isAlpha = functions.isAlpha;
const normalizar = functions.normalizar;

// Datos que utilizaremos para las pruebas
const data = {
  canada: 'canada',
  ny: 'ny',
  'ciudad sandino': 'ciudad sandino',
  jinxiu: 'jinxiu',
  'ash shuhada': 'ash shuhada',
  zhongzhai: 'zhongzhai',
  foundiougne: 'foundiougne',
  'sekongkang bawah': 'sekongkang bawah',
  nangalisan: 'nangalisan',
  nankou: 'nankou',
  maiami: 'maiami',
  'san rafael del sur': 'san rafael del sur',
  'vicente guerrero': 'vicente guerrero',
  chemerivtsi: 'chemerivtsi',
  ordynskoye: 'ordynskoye',
  yashalta: 'yashalta',
  polevskoy: 'polevskoy',
  krasnogorskiy: 'krasnogorskiy',
  ifo: 'ifo',
  amiens: 'amiens',
  tororo: 'tororo',
  cabinda: 'cabinda',
  kilifi: 'kilifi',
  banyo: 'banyo',
  kotlovka: 'kotlovka',
  kopstal: 'kopstal',
  putukrejo: 'putukrejo',
  xitieshan: 'xitieshan',
  dagupan: 'dagupan',
  'las flores': 'las flores',
  hobaramachi: 'hobaramachi',
  chayek: 'chayek',
  'inabaan sur': 'inabaan sur',
  eskilstuna: 'eskilstuna',
  vailoatai: 'vailoatai',
  cungking: 'cungking',
  montlucon: 'montlucon',
  'ali al gharbi': 'ali al gharbi',
  kelburn: 'kelburn',
  miami: 'miami',
  yanagawa: 'yanagawa',
  'san pedro': 'san pedro',
  vyshhorod: 'vyshhorod',
  sydney: 'sydney',
  mukhen: 'mukhen',
  jiexiu: 'jiexiu',
  shimorskoye: 'shimorskoye',
  shorapani: 'shorapani',
  paratinga: 'paratinga',
  faisalabad: 'faisalabad',
  'chum phae': 'chum phae',
  macayug: 'macayug',
  portez: 'portez',
  changning: 'changning',
  kalipucang: 'kalipucang',
  Acapulco: 'Acapulco',
  Matamoros: 'Matamoros',
  Berlin: 'Berlin',
  Helsinki: 'Helsinki',
  Oslo: 'Oslo',
  Toko: 'Tokio',
  Denver: 'Denver',
  Moscu: 'Moscu',
  Lisboa: 'Lisboa',
  Nairobi: 'Nairobi',
  Rio: 'Rio',
  aoyang: 'aoyang',
  novorossiysk: 'novorossiysk',
  sulengwaseng: 'sulengwaseng',
  xishan: 'xishan',
  koczygowy: 'koczygowy',
  oesapa: 'oesapa',
  sandviken: 'sandviken',
  balatun: 'balatun',
  balitoc: 'balitoc',
  songnim: 'songnim',
  dovhe: 'dovhe',
  'svay rieng': 'svay rieng',
  takarazuka: 'takarazuka',
  hodos: 'hodos',
  'zgornje jezersko': 'zgornje jezersko',
  pictou: 'pictou',
  micheng: 'micheng',
  pamatang: 'pamatang',
  mapusagafou: 'mapusagafou',
  'la huerta': 'la huerta',
  rudky: 'rudky',
  fusagasuga: 'fusagasuga',
  kolirerek: 'kolirerek',
  'argotirto krajan': 'argotirto krajan',
  musanze: 'musanze',
  'mbanza congo': 'mbanza congo',
  'el estor': 'el estor',
  pasir: 'pasir',
  ganping: 'ganping',
  isawa: 'isawa',
  ishqoshim: 'ishqoshim',
  'san vicente': 'san vicente',
  borisovka: 'borisovka',
  savannalamar: 'savannalamar',
  dampol: 'dampol',
  proptisht: 'proptisht',
  inowrocaw: 'inowrocaw',
  'hribloski potok': 'hribloski potok',
  hashtgerd: 'hashtgerd',
  trzic: 'trzic',
  baijiang: 'baijiang',
  kozmodemyansk: 'kozmodemyansk',
  sandakan: 'sandakan',
  grenoble: 'grenoble',
  'aldeia da bela vista': 'aldeia da bela vista',
  dongjiao: 'dongjiao',
  adamas: 'adamas',
  asembagus: 'asembagus',
  taoyang: 'taoyang',
  'bom sucesso': 'bom sucesso',
  dibulla: 'dibulla',
  grujugan: 'grujugan',
  'emiliano zapata': 'emiliano zapata',
  udachny: 'udachny',
  chenfangji: 'chenfangji',
  vilnyansk: 'vilnyansk',
  'rio branco do sul': 'rio branco do sul',
  bulumulyo: 'bulumulyo',
  '': '',
  curiapo: 'curiapo',
  'porto alegre': 'porto alegre',
  hayes: 'hayes',
  cimonyong: 'cimonyong',
  kayapa: 'kayapa',
  diriamba: 'diriamba',
  skrwilno: 'skrwilno',
  nubl: 'nubl',
  stockholm: 'stockholm',
  gaoping: 'gaoping',
  kure: 'kure',
  sundre: 'sundre',
  ostrzeszow: 'ostrzeszow',
  isugod: 'isugod',
  kaya: 'kaya',
  stizhkivske: 'stizhkivske',
  campoverde: 'campoverde',
  paterson: 'paterson',
  acacias: 'acacias',
  ciheras: 'ciheras',
  renfrew: 'renfrew',
  tylicz: 'tylicz',
  'sao filipe': 'sao filipe',
  knyazevolkonskoye: 'knyazevolkonskoye',
  coro: 'coro',
  sheffield: 'sheffield',
  karipidita: 'karipidita',
  karangsari: 'karangsari',
  dashiju: 'dashiju',
  bungoma: 'bungoma',
  trilj: 'trilj',
  karema: 'karema',
  naifalo: 'naifalo',
  pervouralsk: 'pervouralsk',
  'cimanggu wetan': 'cimanggu wetan',
  dongkan: 'dongkan',
  vrbovec: 'vrbovec',
  jatiklampok: 'jatiklampok',
  nusaherang: 'nusaherang',
  gemblengmulyo: 'gemblengmulyo',
  'shuyuan zhen': 'shuyuan zhen',
  injil: 'injil',
  umburarameha: 'umburarameha',
  markusica: 'markusica',
  shahdadkot: 'shahdadkot',
  niandui: 'niandui',
  quinarayan: 'quinarayan',
  carcassonne: 'carcassonne',
  jintao: 'jintao',
  aromashevo: 'aromashevo',
  'ulster spring': 'ulster spring',
  'el alamo': 'el alamo',
  galitsy: 'galitsy',
  varnavas: 'varnavas',
  muglizh: 'muglizh',
  vecumnieki: 'vecumnieki',
  gengma: 'gengma',
  saintbrunodemontarville: 'saintbrunodemontarville',
  'riang tengah': 'riang tengah',
  linkoping: 'linkoping',
  murom: 'murom',
  arasasan: 'arasasan',
  straszyn: 'straszyn',
  petoa: 'petoa',
  palcza: 'palcza',
  toupi: 'toupi',
  'peras ruivas': 'peras ruivas',
  portdepaix: 'portdepaix',
  beishan: 'beishan',
  kurungannyawa: 'kurungannyawa',
  yatebarrage: 'yatebarrage',
  kisumu: 'kisumu',
  tangdong: 'tangdong',
  mojosari: 'mojosari',
  sempol: 'sempol',
  'thai charoen': 'thai charoen',
  elateia: 'elateia',
  jundian: 'jundian',
  'villa urquiza': 'villa urquiza',
  'vila flor': 'vila flor',
  lingcheng: 'lingcheng',
  mlangali: 'mlangali',
  xixiang: 'xixiang',
  katiola: 'katiola',
  ketanggi: 'ketanggi',
  bebedouro: 'bebedouro',
  pecoro: 'pecoro',
  nanterre: 'nanterre',
  sighnaghi: 'sighnaghi',
  wedoro: 'wedoro',
  rawa: 'rawa',
  springfield: 'springfield',
  jieznas: 'jieznas',
  pajagan: 'pajagan',
  hidalgo: 'hidalgo',
  richmond: 'richmond',
  louny: 'louny',
  rainis: 'rainis',
  jinhe: 'jinhe',
  ozarowice: 'ozarowice',
  bronx: 'bronx',
  pamas: 'pamas',
  'nova cruz': 'nova cruz',
  bosilovo: 'bosilovo',
  'joao pessoa': 'joao pessoa',
  kebonan: 'kebonan',
  sypniewo: 'sypniewo',
  jiadingzhen: 'jiadingzhen',
  turka: 'turka',
  neglasari: 'neglasari',
  jiefang: 'jiefang',
  cessonsevigne: 'cessonsevigne',
  jicun: 'jicun',
  voznesenye: 'voznesenye',
  'sao paulo de olivenca': 'sao paulo de olivenca',
  fukuroi: 'fukuroi',
  'jose de freitas': 'jose de freitas',
  dashiqiao: 'dashiqiao',
  raemude: 'raemude',
  liushui: 'liushui',
  cardal: 'cardal',
  khorugh: 'khorugh',
  modderfontein: 'modderfontein',
  kambia: 'kambia',
  pyrgos: 'pyrgos',
  asahikawa: 'asahikawa',
  hotaka: 'hotaka',
  'tidili mesfioua': 'tidili mesfioua',
  gunan: 'gunan',
  bajera: 'bajera',
  'north saanich': 'north saanich',
  kuragakikosugi: 'kuragakikosugi',
  maesan: 'maesan',
  viljoenskroon: 'viljoenskroon',
  boliney: 'boliney',
  kalandagan: 'kalandagan',
  candelaria: 'candelaria',
  puttalam: 'puttalam',
  'nizhniy lomov': 'nizhniy lomov',
  chengzi: 'chengzi',
  sebba: 'sebba',
  ndungu: 'ndungu',
  alvdalen: 'alvdalen',
  piura: 'piura',
  'castelo de vide': 'castelo de vide',
  kbenhavn: 'kbenhavn',
  iktabah: 'iktabah',
  'novi seher': 'novi seher',
  zhongguanyi: 'zhongguanyi',
  'grande riviere noire': 'grande riviere noire',
  zgobien: 'zgobien',
  andop: 'andop',
  sagang: 'sagang',
  gevgelija: 'gevgelija',
  zhangjiachang: 'zhangjiachang',
  'santo isidro': 'santo isidro',
  'nea ankhialos': 'nea ankhialos',
  bukonyo: 'bukonyo',
  huambo: 'huambo',
  saffle: 'saffle',
  andalan: 'andalan',
  porvenir: 'porvenir',
  shenavan: 'shenavan',
  ustkamenogorsk: 'ustkamenogorsk',
  aviles: 'aviles',
  kolomyya: 'kolomyya',
  'ban phaeo': 'ban phaeo',
  touzim: 'touzim',
  mikhaylov: 'mikhaylov',
  'ban talat nua': 'ban talat nua',
  hobscheid: 'hobscheid',
  medvea: 'medvea',
  merritt: 'merritt',
  luziania: 'luziania',
  brzeznica: 'brzeznica',
  wengang: 'wengang',
  sumenep: 'sumenep',
  hukkyori: 'hukkyori',
  'nong yai': 'nong yai',
  batutulis: 'batutulis',
  tymoshivka: 'tymoshivka',
  yangji: 'yangji',
  suyo: 'suyo',
  hechuan: 'hechuan',
  centenary: 'centenary',
  lacroixsaintouen: 'lacroixsaintouen',
  'alvares machado': 'alvares machado',
  'francova lhota': 'francova lhota',
  kidatu: 'kidatu'
}

// Para ejecutar, correr el comando :   node test.js

// Archivo para realizar las pruebas unitarias
var prueba_alpha="12344444";

const prueba_is_alpha = () =>{
  if(isAlpha(prueba_alpha)===false){
    console.log("----Prueba isAlpha() Funciona-----");
  }else {
    console.log("----Prueba isAlpha() No Funciona-----");
  }
}
const prueba_normalizar = () =>{
  var anormalizar="Líc-q.";
  var normalizada=normalizar(anormalizar);
  var esperado="licq"

  if(normalizada===esperado){
    console.log("----Prueba normalizar() Funciona----");
  }else{
    console.log("----Prueba nomalizr() No Funciona-----");
  }
}

// Prueba de la función partition_data
// Recibe un arreglo de jsons y un arreglo con direcciones de servidores.
// Regresa una lista de arreglos, cada elemento tiene a lo más 55 elementos y tiene una dirección asociada a un servidor
const partition_data_test = (data, servers) =>{
  console.log("----Ejcutando pruebas unitarias para partition_data ... ");
  var segments = partition_data(data, servers);
  // Sabemos que el método tiene que generar exactamente un arreglo con #ElemsData/55
  let size = Math.ceil(Object.keys(data).length/55);
  if(segments.length != size){
    console.log("----Error en el tamaño de los arreglos");
  }else{
    console.log("----Prueba de tamaño aceptada ... ");
  }
  // Verificamos que tengan asignados los mismos servidores
  for(var i = 0; i < segments.length; i++){
    if(segments[i]["server"] != servers[i]){
      console.log("----Error en la asignación de servidores");
    }else{
      console.log("----Prueba de asignación de servidores aceptada ... ");
    }
  }
  // Vamos a verificar que la partición tenga los mismos elementos que los datos iniciales
  size = 0;
  for(var i = 0; i < segments.length; i++){
    size = size + Object.keys(segments[i]["data"]).length;
  }
  if(size != Object.keys(data).length){
    console.log("----No se han regresado todos los elementos de la partición inicial");
  }else{
    console.log("----Prueba de igualdad en datos aceptada ... ");
  }
  // Ahora verificaremos si son exactamente los mismos objetos, sin pérdida de información
  for(var i = 0; i < segments.length; i++){
    for(var key in segments[i]["data"]){
      if(!(key in data)){
        console.log("----Se han agregado elementos inexistentes a la partición");
      }
    }
  }
  console.log("----Prueba de consistencia de datos aceptada ... ");
  return true;
}

partition_data_test(data, servers);
prueba_is_alpha();
prueba_normalizar();
const read_file = functions.read_file;
const write_file = functions.write_file;
write_file("hola.txt", Date.now());
write_file("hola.txt", Date.now());
