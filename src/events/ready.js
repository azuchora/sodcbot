const ExtendedClient = require('../structures/ExtendedClient');
const getQueries = require('../database/queries/getters');
const { Events } = require('discord.js');
const { log } = require('../tools/logger');
const { getBattlemetricsServerInfo } = require('../tools/battleMetricsAPI');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * 
	 * @param {ExtendedClient} client
	 */
	async execute(client){
		log(`Logged in as ${client.user.tag}`, 'done');
		const serverList = await getQueries.getServerList();
        if(serverList){
            serverList.forEach(server => {
                client.collection.trackedServers.set(server.serverId, {
					count: server.count,
					data: null,
				});
            })
        }
		setInterval(async()=>{
			for(const server of client.collection.trackedServers){
				const serverId = server[0];
				const page = await getBattlemetricsServerInfo(client, serverId, true);
				if(!page) continue;
				const info = server[1];
				info.data = page;
				client.collection.trackedServers.set(serverId, info);
			}
		}, 6 * 1000);
	},
};