const result = document.querySelector('#result');
function getStarted(){
    country = document.querySelector('#country').value;

    if(country){
        alert("Vamos começar!");
        let datatablePesquisa = $("#table_search_result");
        let paginaAtual = 0;
        let pesquisaAtual = '';

        if (window.Worker) {
            const myWorker = new Worker("mainWorker.js");
            myWorker.postMessage(country);

            datatablePesquisa.DataTable({
                paging: false,
                dom: 'Bfrtip',
                select: true,
                buttons: [
                    {
                        text: '0',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 0)
                        }
                    },
                    {
                        text: '1',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 1)
                        }
                    },
                    {
                        text: '2',
                        action: function () {
                            preencherTabelaPesquisa($(result).val().toString(), 1)
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

                var cities =  fazRequisicao(url);

                if (cities) {
                    alert('Nenhuma cidade foi encontrado!');
                } else {
                    preencherTabelaRec(cities);
                }
            }
            function preencherTabelaRec(cities=[]) {
                myWorker.onmessage = function(e) {
                    result.textContent = e.data;
                    console.log('Recebeu retorno dos workers!');
                }
                let tamanho = cities.length;
                console.log("Tamanho para preencher, %i", tamanho);
                datatablePesquisa.DataTable().row.add([cities["id"], cities["population"], 10]).draw();
            }
        } else {
            console.log('Seu browser não suporta web workers.');
        }
    }else{
        alert("Favor inserir nome do país");
    }
}