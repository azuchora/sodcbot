const {model, Schema} = require('mongoose');
const sessionSchema = require('./sessionSchema');

module.exports = model('PlayerSchema', 
    new Schema({
        bmid: {
            type: String,
            default: null,
        },
        updateDate: {
            type: Date,
            required: true,
        },
        name: {
            type: String,
        },
        count: {
            type: Number,
            default: 1,
        },
        sessions: [sessionSchema],
    }),
);