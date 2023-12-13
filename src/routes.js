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

routes.use('/js', express.static(path.join(__dirname, 'js')));
routes.use('/css', express.static(path.join(__dirname, 'css')));
routes.use('/dataTable/js', express.static(path.join(__dirname, 'dataTable/js')));
routes.use('/dataTable/css', express.static(path.join(__dirname, 'dataTable/css')));

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

//js
routes.get('/jquery.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('jquery.min.js', { root: path.join(__dirname, 'js') });
});

//dataTable/js
routes.get('/dataTable/js/datatables.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('datatables.min.js', { root: path.join(__dirname, 'dataTable/js') });
});
routes.get('/dataTable/js/dataTables.select.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('dataTables.select.min.js', { root: path.join(__dirname, 'dataTable/js') });
});
routes.get('/dataTable/js/dataTables.buttons.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('dataTables.buttons.min.js', { root: path.join(__dirname, 'dataTable/js') });
});
routes.get('/dataTable/js/dataTables.autoFill.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('dataTables.autoFill.min.js', { root: path.join(__dirname, 'dataTable/js') });
});
routes.get('/dataTable/js/dataTables.bootstrap5.min.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile('dataTables.bootstrap5.min.js', { root: path.join(__dirname, 'dataTable/js') });
});

routes.get('/index.js', cors(corsOptions), (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'index.js'));
});

//Rotas css
routes.get('/buttons.dataTables.min.css', (req, res) => {
    res.type('text/css');
    res.sendFile('buttons.dataTables.min.css', { root: path.join(__dirname, 'dataTable/css') });
});

routes.get('/datatables.min.css', (req, res) => {
    res.type('text/css');
    res.sendFile('datatables.min.css', { root: path.join(__dirname, 'dataTable/css') });
});

routes.get('/select.dataTables.min.css', (req, res) => {
    res.type('text/css');
    res.sendFile('select.dataTables.min.css', { root: path.join(__dirname, 'dataTable/css') });
});

// Rota do HTML
routes.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = routes;
