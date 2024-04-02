const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerAddPlayerModal } = require('../discordModals');

module.exports = {
    customId: 'trackerAddPlayerButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const modal = getTrackerAddPlayerModal();
        await interaction.showModal(modal);
    }
};
