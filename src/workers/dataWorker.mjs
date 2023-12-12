const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
let chaveVariavel = '';
let tempo = 0;

onmessage = async function (array) {
    //Separando o buffer e o cabeçalho
    let bufferCompartilhado = array.data.buffer;
    let bufferView = new Int32Array(bufferCompartilhado);
    chaveVariavel = array.data.key.apiKey;
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
    for(let j = 0; j < 20; j = j + 10){
        //ainda tenho que incrementar o tempo, para fazer mais requisições em cada worker
        tempo = tempo + 1500;
        let tempArray = await coletarDados( bufferView, j, 10, tempo, cabecalhoRequisicao);
        console.log('temp com retorno da coleta', tempArray)
        for (let i = 0; i < 10; i++) {
            // Armazene os dados no objeto bufferCompartilhado
            bufferView = tempArray[i];
        }
        console.log('buffer depois da coleta', bufferView);
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
        console.log('temp array coleta dados', tempArray);
        //para esperar mais
        resolve(tempArray);
    });
}

//função para substituir o seTimeOut dentro da busca de dados, como estou fazendo requisições paralelas ela não funcionou
// para esse contexto, a Api estava bloqueando as requisições
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
