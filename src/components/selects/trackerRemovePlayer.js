const { StringSelectMenuInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getServer } = require('../../tools/servers');
const { refreshTracker } = require('../../tools/discordTools');

module.exports = {
    customId: 'trackerRemovePlayerSteamSelect',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.reference.messageId);

        for(const playerid of interaction.values){
            const index = tracker.players.findIndex(p => String(p).includes(playerid));
            if(index !== -1){
                tracker.players.splice(index, 1);
            }
        }
        const server = await getServer(client, tracker.serverId);
        const serverInfo = server?.data;

        // await updateTracker(client, tracker);
        await refreshTracker(client, tracker, serverInfo, null, null);
        await GuildQueries.updateGuild(guild);
    }
};