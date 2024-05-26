const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { createPlayer } = require('../../tools/players');
const { getServer } = require('../../tools/servers');
const { refreshTracker } = require('../../tools/discordTools');

module.exports = {
    customId: 'trackerAddPlayerBmModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(!tracker){
            await interaction.message.delete();
            return;
        }
        if(tracker.players.length >= 20) return;

        if(tracker.players.find((p) => p.bmid == battlemetricsId && p.steamid == null)) return;

        const bmInfo = await getBattlemetricsPlayerInfo(client, battlemetricsId);
        if(!bmInfo) return;

        const server = await getServer(client, tracker.serverId);
        const serverInfo = server?.data;
        const playerInfo = serverInfo?.players.find((p) => p.id === battlemetricsId);

        const player = {
            bmid: battlemetricsId,
            steamid: null,
            name: bmInfo.name,
            prevName: null,
            status: playerInfo ? true : false,
            playTime: playerInfo?.session?.duration,
        };
        tracker.players.push(player);
        await createPlayer(player.bmid);
        // await updateTracker(client, tracker);
        await refreshTracker(client, tracker, serverInfo, null, null);
        await GuildQueries.updateGuild(guild);
    }
};