const { model, Schema } = require('mongoose');
const PlayerSchema = require('./playerSchema');

module.exports = new Schema({
        name: {
            type: String,
            default: 'Player tracker',
        },
        active: {
            type: Boolean,
            required: true,
        },
        channelId: {
            type: String,
            required: true,
        },
        messageId: {
            type: String,
            required: true,
        },
        everyone: {
            type: Boolean,
            required: true,
        },
        serverId: {
            type: String,
            default: null,
        },
        players: [PlayerSchema],
        nameChangeHistory: [String],
    }
);