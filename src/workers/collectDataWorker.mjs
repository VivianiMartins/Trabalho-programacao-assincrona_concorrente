const key0 = { apiKey: 'af27a3e0abmsha4afad9c0ff7f47p19c5f0jsn71ce6955627c'};//v2
const key1 = { apiKey: '4436f0209bmsh173bbb4d9e99ae7p1c4814jsn23aa9ba126e6'};//v3
const key2 = { apiKey: 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b'};//v1
const key3 = { apiKey: '395cf27038mshdb83f05a51cd4b3p107c7ajsnf9127a05a42f'};//l1

const numeroWorkers = 4;
var workers = [];
let bufferCompartilhado = new SharedArrayBuffer(1024**2);
//irei salvar os dados do bufferCompartilhado em um array para poder mandar para o html
var arrayCity = new Uint8Array(bufferCompartilhado);
let inicio = 0;//cada worker vai ter 500 dados para coletar dos 1000
const textDecoder = new TextDecoder();
let decodedTextCities = [];

inicializaBuffer();
async function inicializaBuffer() {
    //Aqui você faz a separação dos trabalhos entre os workers para coletar os dados
    for (let i = 0; i < numeroWorkers; i++) {
        workers[i] = new Worker('./dataWorker.mjs', {type: 'module'});
        let tempKey = eval('key' + i);
        //console.log(inicio);
        workers[i].postMessage({buffer: arrayCity, key: tempKey, begin: inicio});
        inicio = inicio + 500;
    }
    console.log('Espere 75 segundos para visualizar os dados');
    setTimeout(async () => {
        //Pegando os dados para colocar na view
        const temp = Array.from(arrayCity);
        //esses dados tem que ser decodificados para voltarem a ser strings
        //console.log('Dados após o término dos workers:', temp);

        decodedTextCities = await decodeAndParseArrayBuffer(arrayCity);
        // Exibe os dados no console
        //console.log('Dados decodificados', decodedTextCities);

        //conferindo a quantidade de dados
        const numeroDeColchetes = (decodedTextCities.match(/\[/g) || []).length;
        //console.log(numeroDeColchetes);

        //enviando os dados para o index.js
        postMessage(decodedTextCities);
    }, 75000);

}

// Função para decodificar e analisar o ArrayBuffer
async function decodeAndParseArrayBuffer(arrayBuffer) {
    // Converte o ArrayBuffer para Uint8Array
    let uint8Array = new Uint8Array(arrayBuffer);
    // Decodifica Uint8Array para string usando TextDecoder
    let decodedText = textDecoder.decode(uint8Array);
    //retirando campos indesejados
    decodedText = decodedText.replace(/\]\[/g, ",");
    decodedText = decodedText.replace(/\u0000/g, '');
    decodedText = decodedText.replace(/\"/g, '');
    decodedText = decodedText.replace(/\'/g, '');
    decodedText = decodedText.replace(/\\/g,'');
    // Analisa a string JSON de volta para um objeto
    return  JSON.stringify(decodedText);
}


setTimeout(async () => {
    const myWorker2 = new Worker("./mainWorker.mjs", {type: 'module'});
    //console.log('Shared Array Buffer do luiz: ', Array.from(arrayCity));
    myWorker2.postMessage(arrayCity);
}, 78000);


