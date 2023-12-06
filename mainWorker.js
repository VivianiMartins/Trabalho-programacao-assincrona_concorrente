const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'af27a3e0abmsha4afad9c0ff7f47p19c5f0jsn71ce6955627c',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
const numeroWorkers = 4;
var workers = [];
//const bufferCompartilhado = new SharedArrayBuffer(1024);
let sendCountry = '';
//enviando país
self.onmessage = (array) => {
    sendCountry = array.data;
};

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers
    var arrayCity = await fazRequisicao(url);
    setTimeout(async () => {
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
        arrayCity[i][5] = arrayCity[i]['id'];
    }
    let centroides = [];
    let grupos = [];
    let tol = 1e-3;
    let houveModificacao = true;

    for(let i = 0; i < numeroWorkers; i++){
        workers[i] = new Worker('worker.js');

        //tentativa de usar buffer compartilhado, porém só entra no outro:
        // if (crossOriginIsolated) {
        //     console.log('buffer 1024');
        //     const bufferCompartilhado = new SharedArrayBuffer(1024);
        //     workers[i].postMessage(bufferCompartilhado);
        // } else {
        //     console.log('buffer 16');
        //     const bufferCompartilhado = new ArrayBuffer(16);
        //     workers[i].postMessage(bufferCompartilhado);
        // }


        var centroide = [geraNumeroAleatorio(-90,90), geraNumeroAleatorio(-180,+180)]; //supondo que a latidude e longitude vieram em graus
        while(centroide.includes(centroide)){
           centroide = [geraNumeroAleatorio(-90,90), geraNumeroAleatorio(-180,+180)];
        }
        centroides[i] = centroide;
        grupos[i] = []; //só para inicializar
    }
    //separando as cidades em grupos
    execucoesDoLoop = 0;
    while(houveModificacao){
        if(houveModificacao){
            grupos.pop();
            for(let i = 0; i < numeroWorkers; i++){
                grupos[i] = [];
            }
        }

        houveModificacao = false;
        for(let i = 0; i < arrayCity.length; i+=1){
            let latitude = arrayCity[i][2]; //arrayCity[i][2] tem que ter a latitude
            let longitude = arrayCity[i][3]; //arrayCity[i][3] tem que ter o longitude
            let populacao = arrayCity[i][4]; //arrayCity[i][4] tem que ter a populacao
            menorD = 999999999;
            workerAtribuido = -1;

            for(let j = 0; j < numeroWorkers; j++){
                let d = 2*6371*Math.asin(
                    Math.sqrt(
                        Math.sin(
                            (centroides[j][0]-latitude)/2)*Math.sin(
                                (centroides[j][0]-latitude)/2) + Math.cos(
                                    latitude)*Math.cos(centroides[j][0])*Math.sin(
                                        (centroides[j][1]-longitude)/2)*Math.sin(
                                            (centroides[j][1]-longitude)/2)
                    )
                )/Math.log(populacao);

                if (d <= menorD){
                    menorD = d;
                    workerAtribuido = j;
                }

            }
            if(workerAtribuido!=-1){
                grupos[workerAtribuido].push(arrayCity[i]);
            } else {
                console.log("Item não atribuído a worker algum");
            }
        }

        for(let i = 0; i < numeroWorkers; i++){
            let mediaLatitude = 0;
            let mediaLongitude = 0;

            for(let x = 0; x < grupos[i].length; x+=1){
                mediaLatitude += grupos[i][x][2];
                mediaLongitude += grupos[i][x][3];
            }
            mediaLatitude = mediaLatitude/(grupos[i].length);
            mediaLongitude = mediaLongitude/(grupos[i].length);
            let distancia = 2*6371000*Math.asin(
                Math.sqrt(
                    Math.sin(
                        (centroides[i][0]-mediaLatitude)/2)*Math.sin(
                            (centroides[i][0]-mediaLatitude)/2) + Math.cos(
                                mediaLatitude)*Math.cos(
                                    centroides[i][0])*Math.sin(
                                    (centroides[i][1]-mediaLongitude)/2)*Math.sin(
                                        (centroides[i][1]-mediaLongitude)/2)
                )
            );
            if(distancia >= tol){
                houveModificacao = true;
                centroides[i] = [mediaLatitude, mediaLongitude];
            }
        }
        execucoesDoLoop++;
        if(execucoesDoLoop > (numeroWorkers*200)){// impedir loop infinito
            houveModificacao = false;
            console.log('Loop infinito!!');
        }
    }
    //aguarda a coleta dos dados para iniciar
    for(let i = 0; i < numeroWorkers; i++){
        workers[i].postMessage([grupos[i], [], sendCountry]);
    }},299500);
    //13600 para 100
    //299500 para 2000
}

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function fazRequisicao(url){
    var arrayCity = [];
    //let arrayPage = [];
    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);

    //links de paginação
    //for (let j = 0; j < 3; j++) {
    //    arrayPage[j] = arrayCities.links[j];
    //}

    //pegado as 10 primeiras cidades e colocando no array
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }

    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição/
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    let tempo = 1500;
    for(let j = 10; j < 2000; j = j + 10){
        await coletarDados(arrayCity, j, 10, tempo);
        tempo = tempo + 1500;
    }

    //visualizando arra
   //setTimeout(async () => {
   //    console.log(arrayCity);
   //}, 15100);
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