const Index = require('../models/index');

module.exports = {
    async list(req, res){
        try {
            const indexes = await Index.findAll()
            return res.json(indexes);
        } catch (err) {
            return console.error("Erro na listagem: ", err);
        }
    },
    async show(req, res){
        try {
            const index = await Index.findAll({where: {id: req.params.id}});
            return res.json(index);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    }
}