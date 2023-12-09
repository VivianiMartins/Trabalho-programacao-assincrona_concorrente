//constante que representa o express
const express = require('express');

//app representa o servidor que recebe a função acima
const app = express();
//usando as rotas criadas
const routes = require('./routes');

//change added that caused issues with the playing mechanism. Needed these headers for another
//app.use(function(req, res, next) {
//    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//    next();
//});

app.use('src/', express.static('/src'));
app.use(express.json());
app.use(routes);


app.listen(3080);