const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');

module.exports = {
    customId: 'trackerRefreshButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        await updateTracker(client, tracker, true);
        await interaction.deferUpdate();
    }
};
