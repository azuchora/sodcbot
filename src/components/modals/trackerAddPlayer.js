const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getSteamPlayerInfo } = require('../../tools/steamAPI');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { createPlayer } = require('../../tools/players');
const { refreshTracker } = require('../../tools/discordTools');
const { getServer } = require('../../tools/servers');

module.exports = {
    customId: 'trackerAddPlayerModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        const steamId = interaction.fields.getTextInputValue('addPlayerSteam');
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(tracker.players.length >= 20) return;

        if(tracker.players.find((p) => p.bmid == battlemetricsId && p.steamid == steamId)) return;

        const steamInfo = await getSteamPlayerInfo(client, steamId);
        if(!steamInfo) return;

        const bmInfo = await getBattlemetricsPlayerInfo(client, battlemetricsId);
        if(!bmInfo) return;

        const player = {
            bmid: battlemetricsId,
            steamid: steamId,
            name: steamInfo.personaname,
            prevName: null,
            status: false,
            playTime: null,
        };
        const server = await getServer(client, tracker.serverId);
        const serverInfo = server?.data;
        tracker.players.push(player);
        await createPlayer(player.bmid);
        // await updateTracker(client, tracker);
        await refreshTracker(client, tracker, serverInfo, null, null);
        await GuildQueries.updateGuild(guild);
    }
};