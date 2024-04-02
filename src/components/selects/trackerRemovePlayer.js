const { StringSelectMenuInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    customId: 'trackerRemovePlayerSteamSelect',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {
        const guild = client.collection.guilds.get(interaction.guild.id);
        const tracker = guild.data.trackers.find((t) => t.messageId === interaction.message.reference.messageId);

        for(const selectedPlayer of interaction.values){
            const player = JSON.parse(selectedPlayer);
            const index = tracker.players.findIndex(p => (p.bmid === player.bmid && p.bmid !== null && player.bmid !== null) ||
                (p.steamid === player.steamid && p.steamid !== null && player.steamid !== null));
            if(index !== -1){
                tracker.players.splice(index, 1);
            }
        }

        await client.updateTracker(tracker);
        await interaction.deferUpdate();
    }
};