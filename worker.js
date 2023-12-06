var resultado = [];

self.onmessage = (array) => {
    let elementos = array.data[0];
    let ultimaPosicao = 0;
    //const outro = data[1];
    for(let i= 0; i < tamanho; i++){
        //console.log(elementos[i][1]);
        if(elementos[i][1] == country){
            Atomics.add(array.data[1], ultimaPosicao, elementos[i][5]);
            //outro[ultimaPosicao] =  elementos[i][5];
            ultimaPosicao++;
        }
    }
    //console.log("Array com a lista de resultados");
    //console.log(outro);
};
//para tentar enviar para o index.js para exibir
function pegarResultado(outro){
    resultado = outro;
    //console.log(resultado);
    return resultado;
}
