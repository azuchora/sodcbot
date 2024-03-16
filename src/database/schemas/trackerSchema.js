const { model, Schema } = require('mongoose');
const { PlayerSchema } = require('./playerSchema');

module.exports = model('TrackerSchema', 
    new Schema({
        trackerId: {
            type: Number,
            required: true,
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
        players: {
            type: [PlayerSchema],
        },
        nameChangeHistory: {
            type: [String],
        }
    })
);