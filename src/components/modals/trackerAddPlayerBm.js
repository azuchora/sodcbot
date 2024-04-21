const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');

module.exports = {
    customId: 'trackerAddPlayerBmModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        const playerInfo = await getBattlemetricsPlayerInfo(client, battlemetricsId);
        if(!playerInfo){
            interaction.deferUpdate();
            return;
        }

        const player = {
            bmid: battlemetricsId,
            steamid: null,
            name: null,
            prevName: null,
            status: false,
            playTime: null,
        };
        
        tracker.players.push(player);
        await updateTracker(client, tracker);
        await GuildQueries.updateGuild(guild);
        await interaction.deferUpdate();
    }
};