const ExtendedClient = require('../structures/ExtendedClient');
const { Events } = require('discord.js');
const { log } = require('../tools/logger');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {ExtendedClient} client
	 */
	async execute(client){
		log(`Logged in as ${client.user.tag}`, 'done');
		client.init();
		
		setInterval(async()=>{
			await client.updateServers();
			await client.updateTrackers();
			await client.updateGuilds();
		}, 60 * 1000);
	},
};