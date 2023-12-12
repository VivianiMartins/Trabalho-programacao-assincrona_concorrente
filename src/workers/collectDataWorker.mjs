const key0 = { apiKey: 'af27a3e0abmsha4afad9c0ff7f47p19c5f0jsn71ce6955627c'};//v2
const key1 = { apiKey: '4436f0209bmsh173bbb4d9e99ae7p1c4814jsn23aa9ba126e6'};//v3
const key2 = { apiKey: 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b'};//v1
const key3 = { apiKey: '395cf27038mshdb83f05a51cd4b3p107c7ajsnf9127a05a42f'};//l1

const numeroWorkers = 4;
var workers = [];
let bufferCompartilhado = new SharedArrayBuffer(1024);
//irei salvar os dados do bufferCompartilhado em um array para poder mandar para o html
var arrayCity = new Int32Array(bufferCompartilhado);

inicializaBuffer();

async function inicializaBuffer(){
    //Aqui você faz a separação dos trabalhos entre os workers
    for(let i = 0; i < numeroWorkers; i++){
        let tempKey = eval('key'+i);
        workers[i] = new Worker('./dataWorker.mjs', {type: 'module'});
    }

    for(let i = 0; i < numeroWorkers; i++){
        let tempKey = eval('key'+i);
        workers[i].postMessage({buffer: arrayCity, key: tempKey});
    }

    setTimeout(async () => {
        //Pegando os dados para colocar na view
        const temp = Array.from(arrayCity);
        console.log('Dados após o término dos workers:', temp);
    }, 5000);
}


