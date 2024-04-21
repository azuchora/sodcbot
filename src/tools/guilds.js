const GuildQueries = require('../database/queries/guilds');

module.exports = {
    createGuild: async function (guild){
        await GuildQueries.createGuild(guild);
        return GuildQueries.getGuild(guild.guildId);
    },
    getGuild: async function (guildId){
        let guild = await GuildQueries.getGuild(guildId);
        if(!guild){
            let data = {
                guildId,
                trackers: [],
            };
            return await GuildQueries.createGuild(data);
        }
        return guild;
    },
};