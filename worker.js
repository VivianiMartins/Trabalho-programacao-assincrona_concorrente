var resultado = [];

self.onmessage = (array) => {
    let elementos = array.data[0];
    let ultimaPosicao = 0;
    const outro = [];
    let country = array.data[2];
    let tamanho = elementos.length;

    for(let i= 0; i < tamanho; i++){
        //console.log(elementos[i][1]);
        if(elementos[i][1] == country){
            outro[ultimaPosicao] =  elementos[i][5];
            ultimaPosicao++;
        }
    }
    console.log("Array com a lista de resultados");
    console.log(outro);
    pegarResultado(outro);
};
//para tentar enviar para o index.js para exibir
function pegarResultado(outro){
    resultado = outro;
    //console.log(resultado);
    return resultado;
}
