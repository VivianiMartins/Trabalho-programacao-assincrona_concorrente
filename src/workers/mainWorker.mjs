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
let sendCountry = '';
//enviando país
self.onmessage = (array) => {
    sendCountry = array.data;
};

for(let j = 0; j <1000; j++){
    bufferCompartilhado[j] = ['Anapolis', 'Brasil', 45, -60, 1000];
}

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers

    setTimeout(async () => {
        //aguarda a coleta dos dados para iniciar
        for(let i = 0; i < numeroWorkers; i++){
            workers[i] = new Worker('./worker.mjs', {type: 'module'});
        }
        for(let x = 0; x < numeroWorkers-1; x++){
            workers[x].postMessage([bufferCompartilhado, sendCountry, Math.floor((bufferCompartilhado.length*x)/numeroWorkers), Math.floor((bufferCompartilhado.length*(x+1))/numeroWorkers)]);

        }
        workers[numeroWorkers-1].postMessage([bufferCompartilhado, sendCountry, Math.floor((bufferCompartilhado.length*(numeroWorkers-1))/numeroWorkers), bufferCompartilhado.length]);
    },1000);
    //13600 para 100
    //299500 para 2000
}



