const ServerQueries = require("../database/queries/servers");
const { getBattlemetricsServerInfo } = require("./battleMetricsAPI");
const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require("./logger");

module.exports = {
    /**
     * 
     * @param {ExtendedClient} client 
     */
    createServer: async function (client, serverId){
        await ServerQueries.createServer({
            serverId: serverId,
            count: 1,
        });
        const info = {
            data: null,
            count: 1,
        }
        client.collection.trackedServers.set(serverId, info);
        log(`Created server ${serverId}`, 'info');
        return info;
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    getServer: async function (client, serverId){
        if(!serverId) return null;
        let info = client.collection.trackedServers.get(serverId);
        if(!info){
            info = await module.exports.createServer(client, serverId);
        }

        return info;
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    deleteServer: async function (client, serverId){
        await ServerQueries.deleteServer(serverId);
        await client.collection.trackedServers.delete(serverId);
        log(`Deleted server ${serverId}.`, 'info');
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    updateServer: async function (client, serverId){
        if(!serverId) return null;
        const info = await module.exports.getServer(client, serverId);
        if(info.count <= 0){
            await module.exports.deleteServer(client, serverId);
            return;
        }
        const page = await getBattlemetricsServerInfo(client, serverId, true);
        info.data = page;
        client.collection.trackedServers.set(serverId, info);
        await ServerQueries.updateServer(serverId, info);
        log(`Updated server ${serverId}`, 'info');
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    updateServers: async function (client){
        for(const server of client.collection.trackedServers){
            await module.exports.updateServer(client, server[0]);
        }
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    changeServerCount: async function (client, serverId, number){
        if(!serverId) return;
        const serverInfo = client.collection.trackedServers.get(serverId);
        if(!serverInfo) return;
        serverInfo.count += number;
        if(serverInfo.count <= 0){
            await module.exports.deleteServer(client, serverId);
            return;
        }
        client.collection.trackedServers.set(serverInfo);
        await ServerQueries.updateServer(serverId, serverInfo);
    },
};