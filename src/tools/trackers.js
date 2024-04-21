const ExtendedClient = require('../structures/ExtendedClient');
const ServerTools = require('../tools/servers');
const GuildTools = require('../tools/guilds');
const DiscordTools = require('../tools/discordTools');
const GuildQueries = require('../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('./battleMetricsAPI');
const { getSteamPlayerInfo } = require('./steamAPI');

module.exports = {
    /**
     * @param {ExtendedClient} client
     */
    updateTracker: async function (client, tracker, update = false, guild = null, guildInfo = null){
        if(!tracker.active) return;
        if(update) await ServerTools.updateServer(client, tracker.serverId);
        const server = await ServerTools.getServer(client, tracker.serverId);
        const serverInfo = server?.data;
        
        for(const player of tracker.players){
            const playerInfo = serverInfo?.players.find((p) => p.id === player.bmid || p.attributes.name === player.name);
            if(!playerInfo){
                const bmInfo = (player.bmid !== null) ? await getBattlemetricsPlayerInfo(client, player.bmid) : null;
                const steamInfo = (player.steamid !== null) ? await getSteamPlayerInfo(client, player.steamid) : null;
                
                if(player.name !== steamInfo?.personaname && steamInfo?.name && !bmInfo?.name){
                    player.prevName = player.name;
                    player.name = steamInfo?.personaname;
                }
                else if(player.name !== bmInfo?.name && bmInfo?.name){
                    player.prevName = player.name;
                    player.name = bmInfo?.name;
                }

                player.playTime = null;
                player.status = false;
            } else {
                player.playTime = playerInfo.session.duration;
                player.status = true;
                if(playerInfo.attributes.name !== player.name){
                    player.prevName = player.name;
                    player.name = playerInfo.attributes.name;
                }
            }
        }

        await DiscordTools.refreshTracker(client, tracker, serverInfo, guild, guildInfo);
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    updateTrackers: async function (client){
        for(const guild of client.guilds.cache){
            const guildInfo = await GuildTools.getGuild(guild[0]);
            for(const tracker of guildInfo.trackers){
                await module.exports.updateTracker(client, tracker, false, guild[1], guildInfo);
            }
            await GuildQueries.updateGuild(guildInfo);
        }
    },
};