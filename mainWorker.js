const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt-BR&sort=name';
let numeroWorkers = 4;
let workers = [];

inicializa();

async function inicializa(){

    let arrayCity = await fazRequisicao(url);

    for(let i = 0; i < numeroWorkers; i++){
        workers[i] = new Worker('worker.js');
    }

    for(let i = 0; i < numeroWorkers; i++){
        workers[i].postMessage(arrayCity);
    }
}

async function fazRequisicao(url){
    let arrayCity = [];
    let dados = await realizaRequisicao(url, cabecalhoRequisicao);
    var arrayCities = dados['data']['Object'];

    for (let i = 0; i < arrayCities.length; i++) {
        arrayCity[i] = [arrayCities[i]["id"], 10];
    }
    return arrayCity;
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    try {
        let response = await fetch(url, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}




