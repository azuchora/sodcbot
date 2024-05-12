const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerButtons, getPlayerTrackerButtons } = require('../discordButtons');
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
        await interaction.deferUpdate();
        const guild = await GuildTools.getGuild(interaction.guild.id);
        
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(!tracker){
            await interaction.message.delete();
            return;
        }
        tracker.active = !tracker.active;
        await interaction.message.edit({embed: interaction.message.embeds, components: tracker.isSingle ? getPlayerTrackerButtons(tracker) : getTrackerButtons(tracker)});
        await GuildQueries.updateGuild(guild);
    }
};
