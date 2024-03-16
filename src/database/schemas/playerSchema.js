const {model, Schema} = require('mongoose');

module.exports = model('PlayerSchema', 
    new Schema({
        bmid: {
            type: String,
            required: true,
        },
        steamid: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
    })
);