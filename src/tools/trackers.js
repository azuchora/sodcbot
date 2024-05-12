const ExtendedClient = require('../structures/ExtendedClient');
const ServerTools = require('../tools/servers');
const GuildTools = require('../tools/guilds');
const DiscordTools = require('../tools/discordTools');
const GuildQueries = require('../database/queries/guilds');
const { getBattlemetricsPlayerInfo } = require('./battleMetricsAPI');
const { getSteamPlayerInfo } = require('./steamAPI');
const discordTools = require('../tools/discordTools');
const { log } = require('./logger');

module.exports = {
    /**
     * @param {ExtendedClient} client
     */
    updateTracker: async function (client, tracker, update = false, guild = null, guildInfo = null, firstTime = false){
        if(!tracker.active) return;

        if(tracker.isSingle){
            let player = tracker.players[0];
            let playerInfo = await getBattlemetricsPlayerInfo(client, player.bmid);

            if(playerInfo.name != player.name){
                player.prevName = player.name;
                player.name = playerInfo.name;

                await discordTools.sendTrackerThreadMessage(client, 'playerNameChange', tracker, {
                    player: player,
                    serverName: player.lastSeen.serverName,
                });
            }

            if(!firstTime && player.status != false && !playerInfo.lastSeen.online){
                await DiscordTools.sendTrackerThreadMessage(client, 'playerLeave', tracker, {
                    player: player,
                    serverName: player.lastSeen.serverName,
                });
            }

            if(!firstTime && player.status == false && playerInfo.lastSeen.online){
                await DiscordTools.sendTrackerThreadMessage(client, 'playerJoin', tracker, {
                    player: player,
                    serverName: player.lastSeen.serverName,
                });
            }

            player.status = playerInfo.lastSeen.online;
            player.lastSeen = playerInfo.lastSeen;
            player.nameHistory = playerInfo.nameHistory;

            log(`Updated ${(tracker?._id) ? `tracker ${tracker._id}` : 'new tracker'}`, 'info');
            await DiscordTools.refreshTracker(client, tracker, null, guild, guildInfo);
            return;
        }


        if(update) await ServerTools.updateServer(client, tracker.serverId);
        const server = await ServerTools.getServer(client, tracker.serverId);
        const serverInfo = server?.data;
        
        for(const player of tracker.players){
            let prevStatus = player.status;
            const playerInfo = serverInfo?.players.find((p) => p.id === player.bmid || p.attributes.name === player.name);
            if(!playerInfo){
                const steamInfo = (player.steamid !== null) ? await getSteamPlayerInfo(client, player.steamid) : null;
                
                if(player.name !== steamInfo?.personaname && steamInfo?.personaname){
                    player.prevName = player.name;
                    player.name = steamInfo?.personaname;
                    await discordTools.sendTrackerThreadMessage(client, 'playerNameChange', tracker, {
                        player: player,
                        serverName: serverInfo?.name,
                    });
                }

                if(!firstTime && player.status != false){
                    await DiscordTools.sendTrackerThreadMessage(client, 'playerLeave', tracker, {
                        player: player,
                        serverName: serverInfo?.name,
                    });
                }
                player.playTime = null;
                player.status = false;
            } else {
                player.playTime = playerInfo.session.duration;
                player.status = true;
                if(playerInfo.attributes.name !== player.name){
                    player.prevName = player.name;
                    player.name = playerInfo.attributes.name;
                    await discordTools.sendTrackerThreadMessage(client, 'playerNameChange', tracker, {
                        player: player,
                        serverName: serverInfo?.name,
                    });
                }
                if(!firstTime && prevStatus != true){
                    await DiscordTools.sendTrackerThreadMessage(client, 'playerJoin', tracker, {
                        player: player,
                        serverName: serverInfo?.name,
                    });
                }
            }
        }
        const onlinePlayers = tracker.players.filter((p) => p.status);
        if(onlinePlayers.length == 0 && tracker.players.length != 0 && tracker.onlineCount != 0 && !firstTime){
            await discordTools.sendTrackerThreadMessage(client, 'allOffline', tracker, {
                serverName: serverInfo?.name,
                everyone: tracker.everyone,
            });
        }
        tracker.onlineCount = onlinePlayers.length;
        log(`Updated ${(tracker?._id) ? `tracker ${tracker._id}` : 'new tracker'}`, 'info');
        await DiscordTools.refreshTracker(client, tracker, serverInfo, guild, guildInfo);
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    updateTrackers: async function (client, firstTime = false){
        for(const guild of client.guilds.cache){
            const guildInfo = await GuildTools.getGuild(guild[0]);
            for(const tracker of guildInfo.trackers){
                await module.exports.updateTracker(client, tracker, false, guild[1], guildInfo, firstTime);
            }
            await GuildQueries.updateGuild(guildInfo);
        }
    },
};