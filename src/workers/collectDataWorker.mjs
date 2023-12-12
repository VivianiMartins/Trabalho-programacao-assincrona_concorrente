const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'dd9d5ded5cmsha4eaedebadf7b68p173c21jsn10c725023f5b',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
const numeroWorkers = 4;
var workers = [];

let bufferCompartilhado = new SharedArrayBuffer(1024); //adcionei buffer

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers
    var arrayCity = await fazRequisicao(url);

    for(let i = 0; i < arrayCity.length; i++){
        arrayCity[i][0] = arrayCity[i]['city'];
        arrayCity[i][1] = arrayCity[i]['country'];
        arrayCity[i][2] = arrayCity[i]['latitude'];
        arrayCity[i][3] = arrayCity[i]['longitude'];
        if(arrayCity[i]['population']>1){
            arrayCity[i][4] = arrayCity[i]['population'];
        } else {
            arrayCity[i][4] = 1.0001;
        };
        console.log(arrayCity[i]);

    }



    //for(let i = 0; i < numeroWorkers; i++){
    //    workers[i] = new Worker('worker.js');
    //
    //    if (crossOriginIsolated) {
    //        bufferCompartilhado = new SharedArrayBuffer(1024);
    //        workers[i].postMessage(bufferCompartilhado);
    //    } else {
    //        bufferCompartilhado = new ArrayBuffer(16);
    //        workers[i].postMessage(bufferCompartilhado);
    //    }
    //
    //}
    //
    //for(i = 0; i < numeroWorkers; i++){
    //    workers[i].postMessage([grupos[i], bufferCompartilhado]);
    //}
}

async function fazRequisicao(url){
    var arrayCity = [];
    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);

    //pegado as 10 primeiras cidades
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }
    //tentando pegar pagina por pagina p construir o array de respostas
    coletarDados(arrayCity, 10, 10, 5000);
    console.log("foi um");
    console.log(arrayCity.length);



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
    setTimeout(async () => {
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);

        let j = arrayCity.length;
        console.log(j);
        for (let i = 0; i < 10; i++) {
            arrayCity.push(tempArray.data[i]);
            j++;
        }
        return arrayCity;
    }, time);
}