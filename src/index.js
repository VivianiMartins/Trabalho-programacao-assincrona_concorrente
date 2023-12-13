import './js/jquery.min.js'; // Importe o jQuery, se não estiver globalmente disponível
import './dataTable/js/datatables.min.js'; // Importe o DataTables, se não estiver globalmente disponível

let result = document.querySelector('#result');
let datatablePesquisa = $('#table_search_result');

let paginaAtual = 0;
let pesquisaAtual = '';

window.getStarted = function () {
    alert("Vamos começar, acompanhe pelo console enquanto espera!");

    if (window.Worker) {
        //coletando as cidades
        const myWorker = new Worker("./workers/collectDataWorker.mjs", {type: 'module'});
        myWorker.onmessage = function (event) {
            let cities = event.data;
            //console.log('Dados decodificados recebidos no index.js:', cities);
            preencherTabelaRec(cities);
        };

        setTimeout(async () => {
            datatablePesquisa.DataTable({
                language: {
                    url: '/node_modules/datatables.net/js/language/portuguese-br.js' // Caminho para o idioma português do Brasil
                },
                paging: false,
                dom: 'Bfrtip',
                select: true,
                columns: [
                    { data: 'coluna1' },
                    { data: 'coluna2' },
                    { data: 'coluna2' },
                    { data: 'coluna2' },
                    { data: 'coluna2' },
                    { data: 'coluna2' },
                ],
                buttons:  [
                    {
                        text: '1',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 0)
                        }
                    },
                    {
                        text: '2',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 1)
                        }
                    },
                    {
                        text: '3',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 1)
                        }
                    }
                ]
            });
        }, 8000);
    } else {
        alert('Seu browser não suporta web workers.');
    }
}


function alteraPagina(pagina, pesquisa) {
    pesquisaAtual === pesquisa ? paginaAtual += pagina : paginaAtual = 1;
    pesquisaAtual = pesquisa;
}
async function preencherTabelaPesquisa(city = '', page = 1, limit = 10) {
    datatablePesquisa.DataTable().rows().remove();
    alteraPagina(page, city);
    if (cities) {
        alert('Nenhuma cidade foi encontrado!');
    } else {
        preencherTabelaRec(cities);
    }
}
function preencherTabelaRec(cities=[]) {
    // Encontra todas as ocorrências de texto entre colchetes
    const matches = cities.match(/\[.*?\]/g);
    //console.log(matches);
    if (!matches) {
        console.error('Nenhum texto entre colchetes encontrado.');
        return;
    }
    // Processa cada correspondência
    const extractedTexts = matches.map(match => {
        // Remove os colchetes
        return match.slice(1, -1);
    });
    //console.log(extractedTexts);
    //Limpa a tabela antes de adicionar novas linhas
    datatablePesquisa.DataTable().clear();

    // Adiciona cada item como uma nova linha na tabela
    extractedTexts.forEach(text => {
        // Divida a linha usando a vírgula como delimitador
        let partes = text.split(',');

        // Agora, você tem um array contendo cada parte da linha
        let nome = partes[0];
        let pais = partes[1];
        let latitude = parseFloat(partes[2]);
        let longitude = parseFloat(partes[3]);
        let populacao = parseInt(partes[4]);

        //enviando para a tabela
        datatablePesquisa.DataTable().row.add([nome, pais, latitude, longitude, populacao]).draw();
    });
}
