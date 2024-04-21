const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerButtons } = require('../discordButtons');
const GuildTools = require('../../tools/guilds');
const GuildQueries = require('../../database/queries/guilds');

module.exports = {
    customId: 'trackerActiveButton',
    cooldown: 2,
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = await GuildTools.getGuild(interaction.guild.id);
        
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        tracker.active = !tracker.active;
        await interaction.message.edit({embed: interaction.message.embeds, components: getTrackerButtons(tracker)});
        await GuildQueries.updateGuild(guild);
        await interaction.deferUpdate();
    }
};
