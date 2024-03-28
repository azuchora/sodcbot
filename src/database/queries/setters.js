const GuildSchema = require('../schemas/guildSchema');
const ServersSchema = require('../schemas/serversSchema');
const PlayerSchema = require('../schemas/playerSchema');
const TrackerSchema = require('../schemas/trackerSchema');
const { log } = require('../../tools/logger');

module.exports = {
    saveGuildList: async function(guildListData) {
        try {
            const savedGuilds = await GuildSchema.insertMany(guildListData);
            return savedGuilds;
        } catch (error) {
            log('Failed to save guild list to db.', 'error');
            return null;
        }
    },
    saveGuild: async function(guildData) {
        try {
            const newGuild = new GuildSchema(guildData);
            await newGuild.save();
            return newGuild;
        } catch (error) {
            log('Failed to save guild to db.', 'error');
            return null;
        }
    },
    saveServerList: async function(serverListData) {
        try {
            const savedServers = await ServersSchema.insertMany(serverListData);
            return savedServers;
        } catch (error) {
            log('Failed to save server list to db.', 'error');
            return null;
        }
    },
    saveServer: async function(serverData) {
        try {
            const newServer = new ServersSchema(serverData);
            await newServer.save();
            return newServer;
        } catch (error) {
            log('Failed to save server to db.', 'error');
            return null;
        }
    },
    savePlayer: async function(playerData) {
        try {
            const newPlayer = new PlayerSchema(playerData);
            await newPlayer.save();
            return newPlayer;
        } catch (error) {
            log('Failed to save player to db.', 'error');
            return null;
        }
    },
    saveTracker: async function(trackerData) {
        try {
            const newTracker = new TrackerSchema(trackerData);
            await newTracker.save();
            return newTracker;
        } catch (error) {
            log('Failed to save tracker to db.', 'error');
            return null;
        }
    }
}
