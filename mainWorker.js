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


//const bufferCompartilhado = new SharedArrayBuffer(1024); //adcionei buffer

inicializaBuffer();

async function inicializaBuffer(){ //Aqui você faz a separação dos trabalhos entre os workers
    var arrayCity = await fazRequisicao(url);
    console.log("Teste Luiz");
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
    let centroides = [];
    let grupos = [];

    let houveModificacao = true;

    for(let i = 0; i < numeroWorkers; i++){
        workers[i] = new Worker('worker.js');

        if (crossOriginIsolated) {
            const bufferCompartilhado = new SharedArrayBuffer(1024);
            workers[i].postMessage(bufferCompartilhado);
        } else {
            const bufferCompartilhado = new ArrayBuffer(16);
            workers[i].postMessage(bufferCompartilhado);
        }


        centroides[i] = [geraNumeroAleatorio(-90,90), geraNumeroAleatorio(-180,+180)]; //supondo que a latidude e longitude vieram em graus
        //eu to meio que contando que nao vai ter nenhum centroide igual
        grupos[i] = []; //só para inicializar
    }

    execucoesDoLoop = 0;
    while(houveModificacao){
        houveModificacao = false;
        for(let i = 0; i < arrayCity.length; i+=1){
            let latitude = arrayCity[i][2]; //arrayCity[i][2] tem que ter a latitude
            let longitude = arrayCity[i][3]; //arrayCity[i][3] tem que ter o longitude
            let populacao = arrayCity[i][4]; //arrayCity[i][4] tem que ter a populacao
            menorD = 40072;
            workerAtribuido = -1;
            console.log('distribuindo grupos');
            console.log(menorD);
            console.log(workerAtribuido);

            for(let j = 0; j < numeroWorkers; j++){
                console.log(j);
                let d = 2*6371*Math.asin(Math.sqrt( Math.sin((centroides[j][0]-latitude)/2)*Math.sin((centroides[j][0]-latitude)/2) + Math.cos(latitude)*Math.cos(centroides[j][0])*Math.sin((centroides[j][1]-longitude)/2)*Math.sin((centroides[j][1]-longitude)/2) ))/Math.log(populacao);
                console.log(d);

                if (d <= menorD){
                    menorD = d;
                    console.log(d);
                    console.log(menorD);
                    workerAtribuido = j;
                    console.log(workerAtribuido);
                }
            
            }
            grupos[workerAtribuido].push(arrayCity[i]);
        }

        for(i = 0; i < numeroWorkers; i++){
            let mediaLatitude = 0;
            let mediaLongitude = 0;
            for(i = 0; i < arrayCity.length; i+=1){
                mediaLatitude += arrayCity[i][2];
                mediaLongitude += arrayCity[i][3];
            }
            mediaLatitude = mediaLatitude/(arrayCity.length);
            mediaLongitude = mediaLongitude/(arrayCity.length);

            if([mediaLatitude, mediaLongitude] != centroides[i]){
                houveModificacao = true;
                centroides[i] = [mediaLatitude, mediaLongitude];
            }
        }

        execucoesDoLoop++;
        if(execucoesDoLoop>(k*200)){// impedir loop infinito
            houveModificacao = false;
            console.log('Loop infinito!!');
        }

        if(houveModificacao){
            for(let i = 0; i < numeroWorkers; i++){
                grupos[i] = [];//esvaziando array
            }
        }

    }

    for(i = 0; i < numeroWorkers; i++){
        workers[i].postMessage([grupos[i], bufferCompartilhado]);
    }
}

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function fazRequisicao(url){
    var arrayCity = [];
    let arrayPage = [];
    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);

    //links de paginação
    for (let j = 0; j < 3; j++) {
        arrayPage[j] = arrayCities.links[j];
    }
    //pegado as 10 primeiras cidades
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }

    //tentando pegar pagina por pagina p construir o array de respostas
    coletarDados(arrayPage[1], arrayCity, 10, 10, 5000);
    console.log("foi um");
    console.log(arrayCity.length);


    coletarDados(arrayPage[1], arrayCity, 20, 10, 10000);

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

function coletarDados(arrayPage, arrayCity, min, max, time){
    setTimeout(async () => {
        console.log("Esperou 5s");
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);

        let j = arrayCity.length;
        console.log(j);
        for (let i = 0; i < 10; i++) {
            console.log("Testes Vivi mais dados");
            arrayCity.push(tempArray.data[i]);
            j++;
        }
        console.log("Oi saindo do for");
        return arrayCity;
    }, time);
}




