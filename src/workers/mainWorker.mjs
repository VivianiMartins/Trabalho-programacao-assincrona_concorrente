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
let tamanho = 1000;
//enviando país

for(let j = 0; j <1000; j++){
    bufferCompartilhado[j] = ['Anapolis', 'Brasil', 45, -60, 1000];
}
console.log(bufferCompartilhado[999]);

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers

    setTimeout(async () => {
        //aguarda a coleta dos dados para iniciar
        let buffer = new BigUint64Array(bufferCompartilhado);
        for(let i = 0; i < numeroWorkers; i++){
            workers[i] = new Worker('./worker.mjs', {type: 'module'});
        }
        for(let x = 0; x < numeroWorkers-1; x++){
            let inicio = Math.floor((tamanho*x)/numeroWorkers);
            workers[x].postMessage([buffer, inicio, Math.floor((tamanho*(x+1))/numeroWorkers), tamanho]);

        }
        workers[numeroWorkers-1].postMessage([buffer, Math.floor((tamanho*(numeroWorkers-1))/numeroWorkers), tamanho, tamanho]);
    },1000);
    //13600 para 100
    //299500 para 2000
}



