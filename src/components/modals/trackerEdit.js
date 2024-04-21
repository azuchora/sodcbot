const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const ServerTools = require('../../tools/servers');
const { getBattlemetricsServerInfo } = require('../../tools/battleMetricsAPI');

module.exports = {
    customId: 'trackerEditModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const name = interaction.fields.getTextInputValue('trackerName');
        const serverid = interaction.fields.getTextInputValue('serverId');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        
        if(tracker.name === name && tracker.serverId === serverid){
            await interaction.deferUpdate();
            return;
        }
        if(tracker.serverId !== serverid){
            const newServer = await getBattlemetricsServerInfo(client, serverid);
            if(newServer){
                const server = client.collection.trackedServers.get(tracker.serverId);
                if(server){
                    await ServerTools.changeServerCount(client, tracker.serverId, -1);
                }
                tracker.serverId = serverid;
                await ServerTools.updateServer(client, serverid);
            }
        }
        tracker.name = name;

        await updateTracker(client, tracker);
        await GuildQueries.updateGuild(guild);
        await interaction.deferUpdate();
    }
};