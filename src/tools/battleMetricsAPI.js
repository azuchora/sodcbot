const config = require('../config');
const { log } = require('./logger');
const ExtendedClient = require('../structures/ExtendedClient');

const request = async (url) => {
    try{
        if (config.BATTLEMETRICS_TOKEN === null){
            return await fetch(url, {
                method: 'GET'
            });
        }
        return await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.BATTLEMETRICS_TOKEN}`
            }
        });
    }
    catch (e){
        return {};
    }
}

module.exports = {
    getBattlemetricsServerPage: async function (client, serverId){
        const url = `https://api.battlemetrics.com/servers/${serverId}?include=player`;
        const response = await request(url);
        if (!response.ok){
            log(`Failed to get server page ${serverId}`, 'warn');
            return null;
        }
        return await response.json();
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */ 
    getBattlemetricsServerInfo: async function (client, serverId, force = null, page = null){
        const serverInfo = client.collection.trackedServers.get(serverId);
        console.log(serverInfo.data);
        if (serverInfo?.data !== null && force !== true && serverInfo?.data !== undefined){
            return serverInfo.data;
        }
        if (page === null){
            page = await module.exports.getBattlemetricsServerPage(client, serverId);
            if(page === null){
                log(`Failed to get server info ${serverId}`, 'warn');
                return null;
            }
        }
        let data = page['data']['attributes'];
        try{
            if(page.length !== null){
                return {
                    name: data.name,
                    address: data.address,
                    ip: data.ip,
                    port: data.port,
                    players: data.players,
                    maxPlayers: data.maxPlayers,
                    rank: data.rank,
                    country: data.country,
                    status: (data.status === 'online') ? true : false,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                }
            }
        }
        catch (e) {}

        return null;
    },
    
    getBattlemetricsPlayerPage: async function (client, playerId){
        const url = `https://api.battlemetrics.com/players/${playerId}?include=identifier,server`;
        const response = await request(url);
        if (!response.ok){
            log(`Failed to get player page ${playerId}`, 'warn');
            return null;
        }
        return await response.json();
    },
    
    getBattlemetricsPlayerInfo: async function (client, playerId, page = null){
        if (page === null){
            page = await module.exports.getBattlemetricsPlayerPage(client, playerId);
            if(page === null){
                log(`Failed to get player info ${playerId}`, 'warn');
                return null;
            }
        }
        let data = page['data']['attributes'];
        let previousNames = [];
        let playTime = 0;
        try{
            if(page.length !== null){
                for(const item of page['included']){
                    if(item.type === 'identifier'){
                        previousNames.push({
                            name: item.attributes.identifier,
                            lastSeen: item.attributes.lastSeen,
                        });
                    }
                    else if(item.type === 'server'){
                        playTime += item.meta.timePlayed;
                    }
                }
                return {
                    name: data.name,
                    createdAt: data.createdAt,
                    nameHistory: previousNames,
                    playTime: `${Math.round(playTime/3600)}`,
                    id: playerId,
                }
            }
        }
        catch (e) {}
        
        return null;
    }
}