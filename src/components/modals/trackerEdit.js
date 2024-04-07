const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

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

        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);
        
        if(tracker.name === name && tracker.serverId === serverid){
            await interaction.deferUpdate();
            return;
        }
        if(tracker.serverId !== serverid){
            const server = client.collection.trackedServers.get(tracker.serverId);
            tracker.serverId = serverid;
            if(server){
                server.count = server.count - 1;
                client.collection.trackedServers.set(tracker.serverId, server);
                await client.updateServer(serverid);
            }
        }
        tracker.name = name;

        await client.updateTracker(tracker);
        await interaction.deferUpdate();
    }
};