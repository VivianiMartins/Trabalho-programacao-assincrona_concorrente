self.onmessage = (array) => {
    //bufferCompartilhado, Math.floor((bufferCompartilhado.length*x)/numeroWorkers), Math.floor((bufferCompartilhado.length*(x+1))/numeroWorkers)
    const textDecoder = new TextDecoder();
    let bufferCompartilhado = array.data[0];
    console.log("Buffer Compartilhado do worker.mjs: ", Array.from(bufferCompartilhado));
    let inicio = array.data[1];
    let fim = array.data[2];
    let tamanho = array.data[3];
    let centroides = [];
    let grupos = [];
    let tol = 1e-3;
    let houveModificacao = true;
    let numeroWorkers = 4; //ISSO DAQUI É O K, SÓ Tô Com Preguiça de mudar
    let workerAtribuido = -1;

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
        for(let x = inicio; x < (fim); x+=1){
            let load = new Uint8Array(50);
            let y = 0
            while (y<50){

               Atomics.store(load, y, Atomics.load(bufferCompartilhado, x));
                y++;
                x++;
            }
            while(Atomics.load(load, load.length-1) == 0){ // While the last element is a 0,
                load = load.slice(0, load.length-1);                 // Remove that last element
            }
            x--;
            console.log(load);
            let decodedText = textDecoder.decode(load);
            decodedText = decodedText.replace(/\]\[/g, ",");
            let decodedTextJson = JSON.parse(decodedText);
            console.log(decodedTextJson);
            let latitude = load[2]; //arrayCity[i][2] tem que ter a latitude
            let longitude = load[3]; //arrayCity[i][3] tem que ter o longitude
            let populacao = load[4]; //arrayCity[i][4] tem que ter a populacao
            let menorD = 999999999;
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

        for(let a = 0; a < numeroWorkers; a++){
            let mediaLatitude = 0;
            let mediaLongitude = 0;

            for(let x = 0; x < grupos[a].length; x+=1){
                mediaLatitude += grupos[a][x][2];
                mediaLongitude += grupos[a][x][3];
            }
            mediaLatitude = mediaLatitude/(grupos[a].length);
            mediaLongitude = mediaLongitude/(grupos[a].length);
            let distancia = 2*6371000*Math.asin(
                Math.sqrt(
                    Math.sin(
                        (centroides[a][0]-mediaLatitude)/2)*Math.sin(
                        (centroides[a][0]-mediaLatitude)/2) + Math.cos(
                        mediaLatitude)*Math.cos(
                        centroides[a][0])*Math.sin(
                        (centroides[a][1]-mediaLongitude)/2)*Math.sin(
                        (centroides[a][1]-mediaLongitude)/2)
                )
            );
            if(distancia >= tol){
                houveModificacao = true;
                centroides[a] = [mediaLatitude, mediaLongitude];
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
