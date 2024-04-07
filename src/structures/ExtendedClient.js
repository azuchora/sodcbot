const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const discordEmbeds = require("../components/discordEmbeds");
const { getBattlemetricsServerInfo } = require('../tools/battleMetricsAPI');
const ServerQueries = require('../database/queries/servers');
const GuildQueries = require('../database/queries/guilds');
const { log } = require('../tools/logger');
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongo = require('../handlers/mongo');
const components = require('../handlers/components');
const { getTrackerButtons } = require("../components/discordButtons");
const { getSteamPlayerInfo } = require("../tools/steamAPI");

module.exports = class extends Client {
    collection = {
        interactionCommands: new Collection(),
        components: {
            buttons: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection(),
            selects: new Collection(),
        },
        trackedServers: new Collection(),
        guilds: new Collection(),
        cooldowns: new Collection(),
    };
    applicationCommandsArray = [];

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
        });
    };
    
    init = async () => {
        const servers = await ServerQueries.getServerList();
        if(servers === null){
            log(`Failed to initialize server list.`, 'err');
            process.exit(1);
        }
        for(const server of servers){
            this.collection.trackedServers.set(server.serverId, {
                count: server.count,
                data: null,
            });
        }
        
        const guilds = await GuildQueries.getGuildList();
        if(guilds === null){
            log(`Failed to initialize guild list.`, 'err');
            process.exit(1);
        }
        for(const guild of guilds){
            this.collection.guilds.set(guild.guildId, { data: guild });
        }
        await this.updateServers();
        await this.updateTrackers();
    };

    getChannel = async(channelId) => {
        try{
            const channel = await this.channels.fetch(channelId);
            return channel;
        } catch(e){
            log(`Couldnt get channel ${channelId}`, 'warn');
            return null;
        }
    };

    getMessage = async (channelId, messageId) => {
        const channel = await this.getChannel(channelId);
        try{
            const message = await channel.messages.fetch(messageId);
            return message;
        } catch(e){
            log(`Couldnt get message ${messageId}`, 'warn');
            return null;
        }
    };

    editMessage = async (message, options = {}) => {
        try{
            const editedMessage = await message.edit(options);
            return editedMessage;
        } catch(e){
            log(`Failed to edit message ${message.id}`, 'warn');
            return null;
        }
    };

    updateTracker = async (tracker, force = false) => {
        if(!tracker.active) return;
        if(this.collection.trackedServers.get(tracker.serverId) === undefined && tracker.serverId !== null){
            this.collection.trackedServers.set(tracker.serverId, { count: 1, data: null });
            await this.updateServer(tracker.serverId);    
        }
        if(force) await this.updateServer(tracker.serverId);
        const serverInfo = (this.collection.trackedServers.get(tracker.serverId))?.data; 
        if(serverInfo){
            for(const player of tracker.players){
                if(player.steamId){
                    const steamInfo = await getSteamPlayerInfo(this, player.steamId);
                    if(player.name !== steamInfo.personaname){
                        player.prevName = player.name;
                        player.name = steamInfo.personaname;
                    }
                }
                const playerInfo = serverInfo.players.find((p) => p.id === player.bmid || p.attributes.name === player.name);
                if(playerInfo){
                    player.playTime = playerInfo.session.duration;
                    player.status = true;
                    if(playerInfo.attributes.name !== player.name){
                        player.prevName = player.name;
                        player.name = playerInfo.attributes.name;
                    }
                }
                else{
                    player.playTime = null;
                    player.status = false;
                }
            }
        }
        try{
            const message = await this.getMessage(tracker.channelId, tracker.messageId)
            const embed = discordEmbeds.getTrackerEmbed(tracker, serverInfo);
            await this.editMessage(message, {
                embeds: [embed],
                components: getTrackerButtons(tracker),
            });
            log(`Updated tracker ${tracker._id}`, 'info');
        } catch(e){
            log(`Failed to update tracker ${tracker._id}`, 'warn');
        }
    };

    updateTrackers = async () => {
        for(const guild of this.collection.guilds){
            for(const tracker of guild[1].data.trackers){
                await this.updateTracker(tracker);
            }
        }
    };

    updateServer = async (serverId) => {
        const info = this.collection.trackedServers.get(serverId);
        const page = await getBattlemetricsServerInfo(this, serverId, true);
        info.data = page;
        this.collection.trackedServers.set(serverId, info);
        log(`Updated server ${serverId}`, 'info');
    }

    updateServers = async () => {
        for(const server of this.collection.trackedServers){
            const serverId = server[0];
            if(server[1]?.count == 0){
                await deleteServer(serverId);
                continue;
            }
            await this.updateServer(serverId);
            await ServerQueries.updateServer(server);
        }
    };

    updateGuild = async (guild) => {
        await GuildQueries.updateGuild(guild);
    };

    updateGuilds = async () => {
        for(const guild of this.collection.guilds){
            await this.updateGuild(guild[1]);
        }
    };

    start = async () => {
        commands(this);
        events(this);
        components(this);
        mongo();
        await this.login(config.DISCORD_TOKEN);
        deploy(this);
    };

};