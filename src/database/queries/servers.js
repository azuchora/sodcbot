const ServersSchema = require('../schemas/serversSchema');
const { log } = require('../../tools/logger');

module.exports = {
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
    createServer: async function(serverData) {
        try {
            const newServer = new ServersSchema(serverData);
            await newServer.save();
            return newServer;
        } catch (error) {
            log('Failed to save server to db.', 'error');
            return null;
        }
    },
    updateServer: async function(serverData){
        try {
            const result = await ServersSchema.updateOne({serverId: serverData[0]}, serverData[1], { upsert: true });
        } catch(e){
            log(`Failed to update server ${serverData[0]}`, 'warn');
        }
    },
    deleteServer: async function(serverId){
        try{
            await ServersSchema.deleteOne({ serverId });
        } catch(e){
            log(`Failed to delete server ${serverId}`, 'warn');
        }
    }
};