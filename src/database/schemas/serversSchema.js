const { model, Schema } = require('mongoose');

module.exports = model('ServersSchema', 
    new Schema({
        serverId: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        count: {
            type: Number,
            default: 1,
            required: true,
        },
    })
);