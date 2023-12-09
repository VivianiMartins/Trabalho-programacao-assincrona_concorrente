module.exports = {
    attributes: {
        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true,
        },
        country: {
            type:'string',
            required: true,
        },
    },
}
