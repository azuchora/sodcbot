const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerAddPlayerSteamModal } = require('../discordModals');

module.exports = {
    customId: 'trackerAddPlayerSteamButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const modal = getTrackerAddPlayerSteamModal();
        await interaction.showModal(modal);
    }
};
