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
        channelName: {
            type: String,
            required: true,
        },
        categoryId: {
            type: String,
            required: true,
        },
        categoryName: {
            type: String,
            required: true,
        },
        messageId: {
            type: String,
            required: true,
        },
        threadId: {
            type: String,
            required: true,
            default: null,
        },
        everyone: {
            type: Boolean,
            required: true,
        },
        serverId: {
            type: String,
            default: null,
        },
        onlineCount: {
            type: Number,
            default: 0,
            required: true,
        },
        players: [PlayerSchema],
        nameChangeHistory: [String],
    }
);