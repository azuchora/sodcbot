const { Events, Interaction } = require('discord.js');
const { log } = require('../tools/logger');
const ExtendedClient = require('../structures/ExtendedClient');


module.exports = {
	name: Events.InteractionCreate,
	/**
	 * 
	 * @param {ExtendedClient} client 
	 * @param {Interaction} interaction 
	 */
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
			log(`Error while executing '${interaction.commandName}' by ${interaction.member.displayName}(${interaction.member})`, 'err');
			console.log(error);
			if (interaction.replied || interaction.deferred){
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};