const { SlashCommandBuilder } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getGuild } = require('../../database/queries/guilds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('test buttons'),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        console.log(await getGuild('2137'));
        await interaction.reply('t');
    }
};
