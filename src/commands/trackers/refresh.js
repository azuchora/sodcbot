const { SlashCommandBuilder } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { updateTrackers } = require('../../tools/trackers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('[DEV] refresh all trackers'),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        await interaction.deferReply();
        await updateTrackers(client);
        await interaction.followUp({content: 'Succesfully refreshed all trackers!', ephemeral: true});
    }
};
