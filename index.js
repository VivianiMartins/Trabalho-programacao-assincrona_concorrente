const result = document.querySelector('#result');
const country = document.querySelector('#country');

let datatablePesquisa = $("#table_search_result");
let paginaAtual = 0;
let pesquisaAtual = '';

if (window.Worker) {
    const myWorker = new Worker("mainWorker.js");

    datatablePesquisa.DataTable({
        paging: false,
        dom: 'Bfrtip',
        select: true,
        buttons: [
            {
                text: '0',
                action: function () {
                    preencherTabelaPesquisa($(country).val().toString(), 0)
                }
            },
            {
                text: '1',
                action: function () {
                    preencherTabelaPesquisa($(country).val().toString(), 1)
                }
            },
            {
                text: '2',
                action: function () {
                    preencherTabelaPesquisa($(country).val().toString(), 1)
                }
            }
        ]
    });

    function alteraPagina(pagina, pesquisa) {
        pesquisaAtual === pesquisa ? paginaAtual += pagina : paginaAtual = 1;
        pesquisaAtual = pesquisa;
    }

    async function preencherTabelaPesquisa(city = '', page = 1, limit = 10) {
        datatablePesquisa.DataTable().rows().remove();

        alteraPagina(page, city);
        let url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
        console.log(url);

        let cities =  fazRequisicao(url);

        if (cities) {
            alert('Nenhuma cidade foi encontrado!');
        } else {
            preencherTabelaRec(cities);
        }
    }

    function preencherTabelaRec(cities=[]) {
        myWorker.onmessage = function(e) {
            result.textContent = e.data;
            console.log('Message received from worker');
        }
        let distance = 0;
        datatablePesquisa.DataTable().row.add([cities["city"], cities["population"], [distance], 10]).draw();
    }

} else {
    console.log('Seu browser não suporta web workers.');
}





