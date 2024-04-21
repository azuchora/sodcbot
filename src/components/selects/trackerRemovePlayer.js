const { StringSelectMenuInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');

module.exports = {
    customId: 'trackerRemovePlayerSteamSelect',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.reference.messageId);

        for(const playerid of interaction.values){
            const index = tracker.players.findIndex(p => String(p).includes(playerid));
            if(index !== -1){
                tracker.players.splice(index, 1);
            }
        }

        await updateTracker(client, tracker);
        await GuildQueries.updateGuild(guild);
        await interaction.deferUpdate();
    }
};