//constante que representa o express
const express = require('express');
//app representa o servidor que recebe a função acima
const app = express();
//usando as rotas criadas
const routes = require('./routes');
const path = require('path');
app.use((req, res, next) => {
    if (path.extname(req.url) === '.mjs') {
        res.type('application/javascript');
    }
    next();
});
app.use(express.json());
app.use('/', routes);
//iniciando servidor na porta 3080
app.listen(3080);