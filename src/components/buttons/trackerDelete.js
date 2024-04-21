const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerAddPlayerSteamModal } = require('../discordModals');
const { updateGuild } = require('../../database/queries/guilds');
const { updateServer } = require('../../database/queries/servers');
const GuildTools = require('../../tools/guilds');
const ServerTools = require('../../tools/servers');

module.exports = {
    customId: 'trackerDeleteButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);

        const index = guild.trackers.findIndex(t => t.messageId === tracker.messageId);

        if(index !== -1){
            const server = client.collection.trackedServers.get(tracker.serverId);
            if(server){
                await ServerTools.changeServerCount(client, tracker.serverId, -1);
            }
            guild.trackers.splice(index, 1);
            await updateGuild(guild);
            await interaction.message.delete();
        }

        await interaction.deferUpdate();
    }
};
