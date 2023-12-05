const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
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
    let arrayPage = [];
    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);
    console.log(arrayCities.links[0]);
    console.log(arrayCities.data[0]);

    for (let j = 1; j < 3; j++) {
        arrayPage[j] = arrayCities.links[j];
        console.log(arrayPage[j]);

    }
    let i = 0;

    //pegado as 10 primeiras cidades
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
        //console.log(arrayCity[i]);
    }

    //tentando pegar pagina por pagina p construir o array de respostas
    //pegndo da próxima página tenho que fazer isso de forma mais eficiente
    setTimeout(async () => {
        console.log("Esperou 5s");
        var temp = arrayPage[1].href;
        var urlTemp = 'https://wft-geo-db.p.rapidapi.com' + temp;
        console.log(urlTemp);
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);
        console.log(tempArray.data[0]);
        let j=0;
        for (let i = 10; i < 20; i++) {
            arrayCity[i] = tempArray.data[j];
            //console.log(arrayCity[i]);
            j++;
        }
    }, 5000);

    for (let i = 0; i < 20; i++) {
        console.log(arrayCity[i]);
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




