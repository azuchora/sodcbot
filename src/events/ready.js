const { Events } = require('discord.js');
const ExtendedClient = require('../structures/ExtendedClient');


module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {ExtendedClient} client
	 */
	execute(client){
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};