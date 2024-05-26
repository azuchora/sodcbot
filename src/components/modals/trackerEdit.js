const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const ServerTools = require('../../tools/servers');
const { getBattlemetricsServerInfo } = require('../../tools/battleMetricsAPI');
const { refreshTracker } = require('../../tools/discordTools');

module.exports = {
    customId: 'trackerEditModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate();
        const name = interaction.fields.getTextInputValue('trackerName');
        if(name.length > 40) return;
        const serverid = interaction.fields.getTextInputValue('serverId');
        if(serverid.length > 40) return;

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        
        if(!tracker){
            await interaction.message.delete();
            return;
        }

        if(tracker.name === name && tracker.serverId === serverid) return;

        let isServerChanged = false;

        if(tracker.serverId !== serverid && typeof(serverid) == 'string'){
            const newServer = await getBattlemetricsServerInfo(client, serverid);
            if(!newServer) return;

            await ServerTools.changeServerCount(client, tracker.serverId, -1);
            tracker.serverId = serverid;
            
            await ServerTools.changeServerCount(client, serverid, 1);
            if(!client.collection.trackedServers.has(serverid)){
                await ServerTools.updateServer(client, serverid);
            }
            isServerChanged = true;
        }
        tracker.name = name;
        if(isServerChanged){
            await updateTracker(client, tracker);
        } else {
            const server = await ServerTools.getServer(client, tracker.serverId);
            const serverInfo = server?.data;
            await refreshTracker(client, tracker, serverInfo);
        }
        await GuildQueries.updateGuild(guild);
    }
};