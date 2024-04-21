const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getSteamPlayerInfo } = require('../../tools/steamAPI');
const GuildTools = require('../../tools/guilds');
const { updateTracker } = require('../../tools/trackers');
const GuildQueries = require('../../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');

module.exports = {
    customId: 'trackerAddPlayerModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const steamId = interaction.fields.getTextInputValue('addPlayerSteam');
        const battlemetricsId = interaction.fields.getTextInputValue('addPlayerBm');

        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);

        const steamInfo = await getSteamPlayerInfo(client, steamId);
        if(!steamInfo){
            await interaction.deferUpdate();
            return;
        }

        const bmInfo = await getBattlemetricsPlayerInfo(client, battlemetricsId);
        if(!bmInfo){
            interaction.reply({ content: 'Invalid battlemetrics id!', ephemeral: true });
            await interaction.deferUpdate();
            return;
        }

        const player = {
            bmid: battlemetricsId,
            steamid: steamId,
            name: steamInfo.personaname,
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