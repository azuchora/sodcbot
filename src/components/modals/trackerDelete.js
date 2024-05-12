const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const ServerTools = require('../../tools/servers');
const { updateGuild } = require('../../database/queries/guilds');

module.exports = {
    customId: 'trackerDeleteModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        const confirmation = interaction.fields.getTextInputValue('trackerConfirm');
        if(confirmation.toLowerCase() !== 'yes'){
            return;
        }
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(!tracker){
            await interaction.message.delete();
            return;
        }

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
    }
};