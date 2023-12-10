export async function fazRequisicao(url) {
    const arrayCity = [];
    const arrayCities = await realizaRequisicao(url, cabecalhoRequisicao);

    for (let i = 0; i < 10; i++) {
        arrayCity[i] = arrayCities.data[i];
    }

    let tempo = 1500;
    for (let j = 10; j < 100; j += 10) {
        await coletarDados(arrayCity, j, 10, tempo);
        tempo += 1500;
    }

    return arrayCity;
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    try {
        const response = await fetch(url, cabecalhoRequisicao);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

async function coletarDados(arrayCity, min, max, time) {
    console.log("Favor aguardar coleta dos dados");
    await new Promise((resolve) => setTimeout(resolve, time));

    console.log("Esperou %i", time);
    const urlTemp = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?offset=${min}&limit=${max}&languageCode=pt_BR&sort=name`;
    const tempArray = await realizaRequisicao(urlTemp, cabecalhoRequisicao);

    let j = arrayCity.length;
    for (let i = 0; i < 10; i++) {
        arrayCity.push(tempArray.data[i]);
        j++;
    }

    return arrayCity;
}