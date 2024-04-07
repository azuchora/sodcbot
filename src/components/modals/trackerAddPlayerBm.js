const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    customId: 'trackerAddPlayerBmModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);

        const player = {
            bmid: battlemetricsId,
            steamid: null,
            name: null,
            prevName: null,
            status: false,
            playTime: null,
        };

        tracker.players.push(player);
        await client.updateTracker(tracker);
        await interaction.deferUpdate();
    }
};