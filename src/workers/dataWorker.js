

const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
const numeroWorkers = 4;
var workers = [];
const bufferCompartilhadoData = new SharedArrayBuffer(1024);
const result = document.querySelector('#result');
let sendCountry = '';
//enviando país
self.onmessage = (array) => {
    sendCountry = array.data;
};

inicializaBuffer1();

async function inicializaBuffer1() { //Aqui você faz a separação dos trabalhos entre os workers
    var arrayCity = await fazRequisicao(url);

    for(let i = 0; i < numeroWorkers; i++){
        workers[i] = new Worker('../worker.js');

    }

}
async function fazRequisicao(url){
    var arrayCity = [];

    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);


    //pegado as 10 primeiras cidades e colocando no array
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }

    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição/
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    let tempo = 1500;
    for(let j = 10; j < 100; j = j + 10){
        await coletarDados(arrayCity, j, 10, tempo);
        tempo = tempo + 1500;
    }

    return  arrayCity;
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    try {
        let response = await fetch(url, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

function coletarDados(arrayCity, min, max, time){
    console.log("Favor aguardar coleta dos dados");
    setTimeout(async () => {
        console.log("Esperou %i", time);
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);

        let j = arrayCity.length;
        for (let i = 0; i < 10; i++) {
            arrayCity.push(tempArray.data[i]);
            j++;
        }
        return arrayCity;
    }, time);
}