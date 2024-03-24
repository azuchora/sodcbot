const { Events } = require('discord.js');
const { log } = require('../tools/logger');
const ExtendedClient = require('../structures/ExtendedClient');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {ExtendedClient} client
	 */
	execute(client){
		log(`Logged in as ${client.user.tag}`, 'done');
	},
};