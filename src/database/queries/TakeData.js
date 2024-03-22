const GuildSchema = require('./guildSchema');
const PlayerSchema = require('./playerSchema');
const TrackerSchema = require('./trackerSchema');

async function readData(guildId) {
    try {
        const guild = await GuildSchema.findOne({ guildId });

        if (!guild) {
            console.log('Server not found');
            return null;
        }
        return guild;
    } catch (error) {
        console.error('Error while reading from database', error);
        return null;
    }
}
