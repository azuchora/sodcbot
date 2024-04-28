const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { createPlayer } = require('../../tools/players');

module.exports = {
    customId: 'trackerAddPlayerBmModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate();
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(tracker.players.length >= 20) return;

        if(tracker.players.find((p) => p.bmid == battlemetricsId && p.steamid == null)) return;

        const playerInfo = await getBattlemetricsPlayerInfo(client, battlemetricsId);
        if(!playerInfo) return;

        const player = {
            bmid: battlemetricsId,
            steamid: null,
            name: playerInfo.name,
            prevName: null,
            status: false,
            playTime: null,
        };
        
        tracker.players.push(player);
        await createPlayer(player.bmid);
        await updateTracker(client, tracker);
        await GuildQueries.updateGuild(guild);
    }
};