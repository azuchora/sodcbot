const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateGuild } = require('../../database/queries/guilds');
const { refreshTracker } = require('../../tools/discordTools');

module.exports = {
    customId: 'playerTrackerEditModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate();
        const name = interaction.fields.getTextInputValue('trackerName');
        if(name.length > 40) return;

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(!tracker){
            return;
        }
        
        if(tracker.name === name) return;
        
        tracker.name = name;
        await refreshTracker(client, tracker);
        await updateGuild(guild);
    }
};