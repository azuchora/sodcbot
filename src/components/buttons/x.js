const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    customId: 'testButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.reply({
            content: 'Dziala!',
            ephemeral: true
        });
    }
};