const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerAddPlayerBmModal } = require('../discordModals');

module.exports = {
    customId: 'trackerAddPlayerBmButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const modal = getTrackerAddPlayerBmModal();
        await interaction.showModal(modal);
    }
};
