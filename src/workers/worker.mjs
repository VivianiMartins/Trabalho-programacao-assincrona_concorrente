self.onmessage = (array) => {
    //bufferCompartilhado, sendCountry, Math.floor((bufferCompartilhado.length*x)/numeroWorkers), Math.floor((bufferCompartilhado.length*(x+1))/numeroWorkers)
    let bufferCompartilhado = new BigUint64Array(array.data[0]);
    let sendCountry = array.data[1];
    let inicio = array.data[2];
    let fim = array.data[3];
    let centroides = [];
    let grupos = [];
    let tol = 1e-3;
    let houveModificacao = true;
    let numeroWorkers = 5; //ISSO DAQUI É O K, SÓ Tô Com Preguiça de mudar

    for(let i = 0; i < numeroWorkers; i++){
        var centroide = [geraNumeroAleatorio(-90,90), geraNumeroAleatorio(-180,+180)]; //supondo que a latidude e longitude vieram em graus
        while(centroides.includes(centroide)){
            centroide = [geraNumeroAleatorio(-90,90), geraNumeroAleatorio(-180,+180)];
        }
        centroides[i] = centroide;
        grupos[i] = []; //só para inicializar
    }
    //separando as cidades em grupos
    let execucoesDoLoop = 0;
    while(houveModificacao){
        if(houveModificacao){
            grupos.pop();
            for(let i = 0; i < numeroWorkers; i++){
                grupos[i] = [];
            }
        }

        houveModificacao = false;
        for(let i = inicio; i < fim; i+=1){
            let load = Atomics.load(bufferCompartilhado, i)
            let latitude = load[2]; //arrayCity[i][2] tem que ter a latitude
            let longitude = load[3]; //arrayCity[i][3] tem que ter o longitude
            let populacao = load[4]; //arrayCity[i][4] tem que ter a populacao
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
                grupos[workerAtribuido].push(Atomics.load(bufferCompartilhado, i));
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

    console.log("Array com a lista de resultados");
    console.log(grupos);
};

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
