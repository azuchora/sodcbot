const GuildSchema = require('../schemas/guildSchema');
const ServersSchema = require('../schemas/serversSchema');
const { log } = require('../../tools/logger');

module.exports = {
    getGuildList: async function(){
        try{
            const guilds = await GuildSchema.find();
            if(!guilds){
                return null;
            }
            return guilds;
        } catch (error){
            log('Failed to get guild list from db.', 'warn');
            return null;
        }
    },
    getGuild: async function(guildId){
        try{
            const guild = await GuildSchema.findOne({ guildId });
            if(!guild){
                return null;
            }
            return guild;
        } catch (error){
            log(`Failed to get guild ${guildId} from db.`, 'warn');
            return null;
        }
    },
    getServerList: async function(){
        try{
            const serverList = await ServersSchema.find();
            if(!serverList){
                return null;
            }
            return serverList;
        } catch (error){
            log(`Failed to retrive server list from db.`, 'warn');
            return null;
        }
    },
    getServer: async function(serverId){
        try{
            const server = await ServersSchema.findOne({ serverId });
            if(!server){
                return null;
            }
            return server;
        } catch (error){
            log(`Failed to get server ${serverId} from db.`, 'warn');
            return null;
        }
    },
}