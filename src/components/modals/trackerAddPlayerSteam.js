const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getSteamPlayerInfo } = require('../../tools/steamAPI');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');

module.exports = {
    customId: 'trackerAddPlayerSteamModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate();
        const steamId = interaction.fields.getTextInputValue('addPlayerSteam');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(tracker.players.length >= 20) return;

        if(tracker.players.find((p) => p.steamid == steamId && p.bmid == null)) return;

        const playerInfo = await getSteamPlayerInfo(client, steamId);
        
        if(!playerInfo) return;

        const player = {
            bmid: null,
            steamid: steamId,
            name: playerInfo.personaname,
            prevName: null,
            status: false,
            playTime: null,
        };

        tracker.players.push(player);
        await updateTracker(client, tracker);
        await GuildQueries.updateGuild(guild);
    }
};