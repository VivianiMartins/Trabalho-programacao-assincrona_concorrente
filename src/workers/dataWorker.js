'use strict'

async function fazRequisicao(url){
    var arrayCity = [];

    var arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);


    //pegado as 10 primeiras cidades e colocando no array
    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }

    //Colocando o restante das cidades no array, tempo sendo aumentado para não haver problemas de requisição/
    //pelos testes não pudemos colocar intervalo menor de 1,5 segundos entre cada
    let tempo = 1500;
    for(let j = 10; j < 100; j = j + 10){
        await coletarDados(arrayCity, j, 10, tempo);
        tempo = tempo + 1500;
    }

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