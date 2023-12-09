//constante que representa o express
const express = require('express');
//usando as rotas criadas
const routes = express.Router();
const IndexController = require('./controllers/indexController');
const url ='https://wft-geo-db.p.rapidapi.com/v1/geo/cities?languageCode=pt_BR&limit=10&sort=name';
const cors = require("cors");

var corsOptions ={
    origin: url,
    methods: ['GET'],
    optionsSuccessStatus: 200
};
routes.get('/worker/*', cors(corsOptions), function (req, res, next) {
    res.sendFile('collectDataWorker.js');
    res.json({msg: 'This is CORS-enabled for only example.com.'});
});
routes.get('/*', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})


module.exports = routes;