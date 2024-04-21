const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerRemovePlayerMenu } = require('../discordSelectMenus');
const GuildTools = require('../../tools/guilds');

module.exports = {
    customId: 'trackerRemovePlayerButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        
        await interaction.reply({ content: 'Select players to remove', components: [getTrackerRemovePlayerMenu(tracker)], ephemeral: true});
    }
};
