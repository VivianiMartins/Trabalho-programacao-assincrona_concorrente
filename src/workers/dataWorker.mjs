const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
let chaveVariavel = 'chaveTemporária';

onmessage = async function (array) {
    //Separando o buffer e o cabeçalho
    let bufferCompartilhado = array.data.buffer;
    chaveVariavel = array.data.key.apiKey;
    await fazRequisicao(url, bufferCompartilhado);
};

async function fazRequisicao(url, bufferCompartilhado){
    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    let tempo = 2500;

    for(let j = 0; j < 40; j = j + 10){
        var tempArray = await coletarDados( bufferCompartilhado, j, 10, tempo);
        console.log(tempArray);
        for (let i = 0; i < 10; i++) {
            // Armazene os dados no objeto bufferCompartilhado
            Atomics.store(bufferCompartilhado, i, tempArray.data[i]);
        }
        //ainda tenho que incrementar o tempo, para fazer mais requisições em cada worker
        tempo = tempo + 1500;
    }
    // Retorne o objeto bufferCompartilhado
    postMessage({ status: 'concluido', buffer: bufferCompartilhado });
}

async function realizaRequisicao(urlTemp, cabecalhoRequisicao) {
    try {
        let response = await fetch(urlTemp, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
    }
    return bufferCompartilhado;
}

let cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': chaveVariavel,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};
function coletarDados( bufferCompartilhado, min, max, tempo){
    return new Promise(async (resolve) => {
        await sleep(tempo);
        console.log(tempo);
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        let tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);
        let j = bufferCompartilhado.length;
        console.log(j);
        for (let i = 0; i < 10; i++) {
            tempArray.data.push(
                tempArray.data[i][0] = tempArray.data[i]['city'],
                tempArray.data[i][1] = tempArray.data[i]['country'],
                tempArray.data[i][2] = tempArray.data[i]['latitude'],
                tempArray.data[i][3] = tempArray.data[i]['longitude'],
                tempArray.data[i][4] = tempArray.data[i]['population']
            );
            j++;
        }
        //para esperar mais
        resolve(tempArray);
    });
}

//função para substituir o seTimeOut dentro da busca de dados, como estou fazendo requisições paralelas ela não funcionou
// para esse contexto, a Api estava bloqueando as requisições
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
