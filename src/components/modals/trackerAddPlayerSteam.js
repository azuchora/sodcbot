const { ModalSubmitInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getSteamPlayerInfo } = require('../../tools/steamAPI');

module.exports = {
    customId: 'trackerAddPlayerSteamModal',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const steamId = interaction.fields.getTextInputValue('addPlayerSteam');

        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.id);
        const playerInfo = await getSteamPlayerInfo(client, steamId);
        
        const player = {
            bmid: null,
            steamid: steamId,
            name: playerInfo.personaname,
            prevName: null,
            status: false,
            playTime: null,
        };

        tracker.players.push(player);
        await client.updateTracker(tracker);
        await interaction.deferUpdate();
    }
};