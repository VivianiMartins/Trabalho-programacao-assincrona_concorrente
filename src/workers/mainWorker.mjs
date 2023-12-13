const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'af27a3e0abmsha4afad9c0ff7f47p19c5f0jsn71ce6955627c',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
let bufferCompartilhado = new SharedArrayBuffer(1024);
const numeroWorkers = 4;
var workers = [];
let tamanho = 250;
//enviando país

self.onmessage = async function (array) {
    //Separando o buffer
    bufferCompartilhado = array.data;
    console.log("Buffer Compartilhado do MainWorker: ", Array.from(bufferCompartilhado));
};

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers

    setTimeout(async () => {
        //aguarda a coleta dos dados para iniciar
        for(let i = 0; i < numeroWorkers; i++){
            workers[i] = new Worker('./worker.mjs', {type: 'module'});
        }
        for(let x = 0; x < numeroWorkers-1; x++){
            workers[x].postMessage([bufferCompartilhado, tamanho*x, tamanho*(x+1), tamanho]);


        }
        workers[numeroWorkers-1].postMessage([bufferCompartilhado, tamanho*(numeroWorkers-1), tamanho*(numeroWorkers), tamanho]);
    },500);
}



