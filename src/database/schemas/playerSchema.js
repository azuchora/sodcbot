const {model, Schema} = require('mongoose');

module.exports = new Schema({
        bmid: {
            type: String,
            default: null,
        },
        steamid: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        prevName: {
            type: String,
            default: null,
        },
        status: {
            type: Boolean,
            default: null,
        },
        playTime: {
            type: String,
            default: null,
        },
        nameHistory: {
            type: [Object],
            default: [],
        },
        lastSeen: {
            type: Object,
            default: undefined,
        },
    }
);