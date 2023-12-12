const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
let chaveVariavel = 'chaveTemporária';

onmessage = function (array) {
    //Separando o buffer e o cabeçalho
    console.log('O que estou recebendo:', array);
    let bufferCompartilhado = array.data.buffer;
    chaveVariavel = array.data.key.apiKey;
    
    fazRequisicao(url, bufferCompartilhado);
    
};

let cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': chaveVariavel,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

async function fazRequisicao(url, bufferCompartilhado){
    const resultadoRequisicao = await realizaRequisicao(url, cabecalhoRequisicao);

    //pegado as 10 primeiras cidades e colocando no array
    for (let i = 0; i < 10; i++) {
        // Armazene os dados no objeto bufferCompartilhado
        bufferCompartilhado.data = resultadoRequisicao.data[i];
    }

    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição/
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    let tempo = 1500;
    for(let j = 10; j < 2000; j = j + 10){
        await coletarDados(bufferCompartilhado, j, 10, tempo);
        tempo = tempo + 1500;
    }

    // Retorne o objeto bufferCompartilhado
    postMessage(bufferCompartilhado);
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    try {
        let response = await fetch(url, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
    }
    return bufferCompartilhado;
}

function coletarDados(bufferCompartilhado, min, max, time){
    setTimeout(async () => {
        let urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
        var tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);

        let j = bufferCompartilhado.length;
        console.log(j);
        for (let i = 0; i < 10; i++) {
            bufferCompartilhado.data.push(
                tempArray.data[i][0] = tempArray.data[i]['city'],
                tempArray.data[i][1] = tempArray.data[i]['country'],
                tempArray.data[i][2] = tempArray.data[i]['latitude'],
                tempArray.data[i][3] = tempArray.data[i]['longitude'],
                tempArray.data[i][4] = tempArray.data[i]['population']
            );
            j++;
        }
        return bufferCompartilhado;
    }, time);
}
