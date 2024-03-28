const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const DBfunctions = require('../../database/queries/setters');

module.exports = {
    customId: 'testButton',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        try {
            const playerId = '1097251382'; 

            const playerData = {
                bmid: playerId,
            };

            const savedPlayer = await DBfunctions.savePlayer(playerData);
            if (savedPlayer) {
                await interaction.reply({
                    content: 'Saved successfully',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while saving the data',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Error', error);
            await interaction.reply({
                content: 'There was an error while saving the data',
                ephemeral: true
            });
        }
    }
};
