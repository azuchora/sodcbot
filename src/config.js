const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    BATTLEMETRICS_TOKEN: process.env.BATTLEMETRICS_TOKEN || null,
    MONGO_URL: process.env.MONGO_URL,
}