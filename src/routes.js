const express = require('express');
const routes = express.Router();
const cors = require("cors");
const path = require("path");

const url = 'https://rapidapi.com/wirefreethought/api/geodb-cities';

const corsOptions = {
    origin: url,
    methods: ['GET'],
    optionsSuccessStatus: 200
};

// Servir arquivos estáticos da pasta 'src'
routes.use('/src', express.static(path.join(__dirname, 'src')));

// Servir arquivos estáticos da pasta 'workers'
routes.use('/workers', express.static(path.join(__dirname, 'workers')));

// Rotas individuais para cada arquivo no diretório 'workers'
routes.get('/collectDataWorker.mjs', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile('collectDataWorker.mjs', { root: path.join(__dirname, 'workers') });
});

routes.get('/dataWorker.mjs', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile('dataWorker.mjs', { root: path.join(__dirname, 'workers') });
});

routes.get('/mainWorker.mjs', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile('mainWorker.mjs', { root: path.join(__dirname, 'workers') });
});

routes.get('/worker.mjs', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile('worker.mjs', { root: path.join(__dirname, 'workers') });
});

routes.get('/index.js', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'index.js'));
});

// Rota do HTML
routes.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = routes;
