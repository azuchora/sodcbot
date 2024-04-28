const {model, Schema} = require('mongoose');

module.exports = new Schema({
        start: {
            type: Number,
            required: true,
        },
        stop: {
            type: Number,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        serverId: {
            type: String,
            required: true,
        },
    }
);