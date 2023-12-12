//v2
const key0 = { apiKey: 'af27a3e0abmsha4afad9c0ff7f47p19c5f0jsn71ce6955627c'};
//l1
const key1 = { apiKey: 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b'};

const key2 = { apiKey: 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b'};
//v1
const key3 = { apiKey: 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b'};

const numeroWorkers = 4;
var workers = [];
let bufferCompartilhado = new SharedArrayBuffer(1024); //adcionei buffer
var arrayCity = [];

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers
    for(let i = 0; i < numeroWorkers; i++){
        let tempKey = eval('key'+i);
        workers[i] = new Worker('./dataWorker.mjs', {type: 'module'});
        workers[i].postMessage({buffer: bufferCompartilhado, key: tempKey});
    }

    for(let i = 0; i < numeroWorkers; i++){
        workers[i].postMessage(arrayCity[i]);
    }

}


