const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerButtons } = require('../discordButtons');

module.exports = {
    customId: 'trackerActiveButton',
    cooldown: 2,
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);
        tracker.active = !tracker.active;
        await interaction.message.edit({embed: interaction.message.embeds, components: getTrackerButtons(tracker)});
        await interaction.deferUpdate();
    }
};
