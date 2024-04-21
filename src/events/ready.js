const ExtendedClient = require('../structures/ExtendedClient');
const { Events } = require('discord.js');
const { log } = require('../tools/logger');
const ServerQueries = require('../database/queries/servers');
const ServerTools = require('../tools/servers');
const TrackerTools = require('../tools/trackers');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {ExtendedClient} client
	 */
	async execute(client){
		log(`Logged in as ${client.user.tag}`, 'done');

		const servers = await ServerQueries.getServerList();
        for(const server of servers){
            client.collection.trackedServers.set(server.serverId, {
                count: server.count,
                data: null,
            });
        }
	
        await ServerTools.updateServers(client);
        await TrackerTools.updateTrackers(client);
		
		setInterval(async()=>{
			await ServerTools.updateServers(client);
			await TrackerTools.updateTrackers(client);
		}, 60 * 1000);
	},
};