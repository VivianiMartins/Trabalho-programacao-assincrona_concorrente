self.onmessage = (array) => {

    var elementos = array.data[0];
    bufferCompartilhado = array.data[1];
    let ultimaPosicao = 0;

    for(let i =0; i< elementos.length; i++){
        if(elementos[i][1].contains(TermoPesquisado)){
            Atomics.add(bufferCompartilhado, ultimaPosicao, [elementos[i][0], arrayCity[i][4]]);
            ultimaPosicao++;
        }
    }
};

