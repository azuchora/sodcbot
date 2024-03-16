const { Events } = require('discord.js');
const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require('../util/logger');

/**
 * 
 * @param {ExtendedClient} client
 */

module.exports = {
	name: Events.InteractionCreate,
	async execute(client, interaction){
		if (!interaction.isChatInputCommand()) return;

		const command = client.collection.interactionCommands.get(interaction.commandName);

		if (!command){
			log(`No command matching ${interaction.commandName} was found.`, 'warn');
			return;
		}

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred){
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};