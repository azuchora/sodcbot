const { model, Schema } = require('mongoose');
const TrackerSchema = require('./trackerSchema');

module.exports = model('GuildSchema', 
    new Schema({
        guildId: {
            type: String,
            index: true,
            required: true,
            unique: true,
        },
        categoryId: {
            type: String,
            default: null,
        },
        trackers: [TrackerSchema],
        firstTime: {
            type: Boolean,
            default: true,
        },
        roleId: {
            type: String,
            default: null,
        },
    })
);