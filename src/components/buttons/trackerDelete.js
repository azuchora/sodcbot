const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerDeleteModal } = require('../discordModals');

module.exports = {
    customId: 'trackerDeleteButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const modal = getTrackerDeleteModal();
        await interaction.showModal(modal);
    }
};
