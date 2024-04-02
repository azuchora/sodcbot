const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerRemovePlayerMenu } = require('../discordSelectMenus');

module.exports = {
    customId: 'trackerRemovePlayerButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);
        
        await interaction.reply({ content: 'Select players to remove', components: [getTrackerRemovePlayerMenu(tracker)], ephemeral: true});
    }
};
