const mongoose = require('mongoose');
const config = require('../config');
const { log } = require('../tools/logger');

module.exports = async () => {
    try{
        await mongoose.connect(config.MONGO_URL);
    }
    catch(e){
        log('Failed to connect to database', 'err');
        process.exit(1);
    }
    log('Connected to database!', 'done');
}