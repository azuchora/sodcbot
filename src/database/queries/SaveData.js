const GuildSchema = require('./guildSchema');
const PlayerSchema = require('./playerSchema');
const TrackerSchema = require('./trackerSchema');

async function saveData(guildData) {
    try {
        const savedGuild = await GuildSchema.findOneAndUpdate({ guildId: guildData.guildId }, guildData, { upsert: true, new: true });

        if (!savedGuild) {
            console.log('Failed to save data');
            return null;
        }

        return savedGuild;
    } catch (error) {
        console.error('Failed to save data', error);
        return null;
    }
}

