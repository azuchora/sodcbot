const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerAddPlayerSteamModal } = require('../discordModals');
const { updateGuild } = require('../../database/queries/guilds');

module.exports = {
    customId: 'trackerDeleteButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);

        const index = guild.data.trackers.findIndex(t => t.messageId === tracker.messageId);

        if(index !== -1){
            guild.data.trackers.splice(index, 1);
            const server = client.collection.trackedServers.get(tracker.serverId);
            if(server){
                server.count = server.count - 1;
                this.collection.trackedServers.set(tracker.serverId, server);
            }
            await updateGuild(guild);
            await interaction.message.delete();
        }

        await interaction.deferUpdate();
    }
};
