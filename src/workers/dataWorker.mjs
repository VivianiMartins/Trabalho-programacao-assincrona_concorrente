const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
let chaveVariavel = '';
let tempo = 0;
let LastId = 0;
let LastIdTemp = 0;
const textEncoder = new TextEncoder();
let inicio = 0;

onmessage = async function (array) {
    //Separando o buffer e o cabeçalho
    let bufferView = array.data.buffer;
    chaveVariavel = array.data.key.apiKey;
    inicio = array.data.begin;
    LastId = inicio;
    await fazRequisicao(url, bufferView);
};

async function fazRequisicao(url, bufferView){
    let cabecalhoRequisicao = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': chaveVariavel,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };
    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    tempo = 1500;
    LastIdTemp = LastId+50;

    for(let j = LastId; j < LastIdTemp; j = j + 10){
        //console.log('Contador j', j);
        //console.log('last id no for', LastId);
        //console.log('last id no for', LastIdTemp);
        //console.log('tempo', tempo);

        //ainda tenho que incrementar o tempo, para fazer mais requisições em cada worker
        tempo = tempo + 1500;
        let tempArray = await coletarDados( bufferView, j, 10, tempo, cabecalhoRequisicao);
        //console.log("tempArray após coleta: ", tempArray);

        for (let i = 0; i < 10; i= i + 1) {
            // Armazene os dados no objeto bufferCompartilhado
            let jsonString = JSON.stringify(tempArray[i]);
            //console.log("json String: ", jsonString);
            let encodedText = textEncoder.encode(jsonString);
            //console.log("enconded text: ", encodedText);
            let k = 0;
            //console.log('tamanho do codificado', encodedText.length);
            for (k; k < encodedText.length; k= k + 1){
                Atomics.store(bufferView, i*80+LastId+k, encodedText[k]);
                //console.log('index', i*80+LastId+k);
            }
            while(k<80){
                //console.log("enconded text[k]: 0");
                Atomics.store(bufferView, i*80+LastId+k, 0);
                //console.log('inicio:', inicio, 'parte', i*80+LastId+k);
                k++;
            }
        }
        LastId+=50;
    }
    // Retorne o objeto bufferCompartilhado
    postMessage( bufferView);
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    try {
        let response = await fetch(url, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
        return { data: [] };
    }
}

function coletarDados( bufferView, min, max, tempo, cabecalhoRequisicao){
    return new Promise(async (resolve) => {
        await sleep(tempo);
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);
        for (let i = 0; i < 10; i++) {
            tempArray[i] = [
                tempArray.data[i]['city'],
                tempArray.data[i]['country'],
                tempArray.data[i]['latitude'],
                tempArray.data[i]['longitude'],
                tempArray.data[i]['population']
            ];
        }
        //console.log('temp array coleta dados', tempArray);
        //para esperar mais
        resolve(tempArray);
    });
}

//função para substituir o seTimeOut dentro da busca de dados, como estou fazendo requisições paralelas ela não funcionou
// para esse contexto, a Api estava bloqueando as requisições
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
