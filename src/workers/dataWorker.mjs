const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';

let cabecalhoRequisicao = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': ' ',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

onmessage = function (array) {
    //Separando o buffer e o cabeçalho
    console.log('O que estou recebendo:', array);
    let bufferCompartilhado = array.data[0];
    let chave = array.data[1];

    console.log('Buffer Compartilhado:', bufferCompartilhado);
    console.log('Chave:', chave);
    bufferCompartilhado = fazRequisicao(url);

};



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