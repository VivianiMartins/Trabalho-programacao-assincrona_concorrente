import './js/jquery.min.js'; // Importe o jQuery, se não estiver globalmente disponível
import './dataTable/js/datatables.min.js'; // Importe o DataTables, se não estiver globalmente disponível

let result = document.querySelector('#result');
let datatablePesquisa = $('#table_search_result');

let paginaAtual = 0;
let pesquisaAtual = '';

window.getStarted = function () {
    alert("Vamos começar!");

    if (window.Worker) {
        //coletando as cidades
        const myWorker = new Worker("./workers/collectDataWorker.mjs", {type: 'module'});
        myWorker.onmessage = function (event) {
            let cities = event.data;
            console.log('Dados decodificados recebidos no index.js:', cities);
            preencherTabelaRec(cities);
        };

        setTimeout(async () => {
            datatablePesquisa.DataTable({
                paging: false,
                dom: 'Bfrtip',
                select: true,
                columns: [
                    { data: 'coluna1' }, // Substitua 'coluna1' pelo nome apropriado
                    { data: 'coluna2' }, // Substitua 'coluna2' pelo nome apropriado

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
        }, 76000);
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
        const textInsideBrackets = match.slice(1, -1);
        return textInsideBrackets;
    });
    console.log(extractedTexts);
    //Limpa a tabela antes de adicionar novas linhas
    datatablePesquisa.DataTable().clear();

    // Adiciona cada item como uma nova linha na tabela
    extractedTexts.forEach(text => {
        datatablePesquisa.DataTable().row.add([text, 10]).draw();
    });
}
