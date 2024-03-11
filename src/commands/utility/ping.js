const { SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
/**
 * 
 * @param {ExtendedClient} client
 */
	async execute(client, interaction){
		await interaction.reply('Pong!');
	},
};