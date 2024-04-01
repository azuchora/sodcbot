const GuildSchema = require('../schemas/guildSchema');
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
    createGuild: async function(guild) {
        try {
            const newGuild = new GuildSchema(guild.data);
            await newGuild.save();
            return newGuild;
        } catch (error) {
            log('Failed to save guild to db.', 'warn');
            return null;
        }
    },
    updateGuild: async function(guild){
        try{
            const result = await GuildSchema.updateOne({ guildId: guild.data.guildId}, guild.data, { upsert: true });
        } catch(e){
            log(`Failed to update guild ${guildId}`, 'warn');
        }
    },
    deleteGuild: async function(guildId){
        try{
            await GuildSchema.deleteOne({guildId});
        } catch(e){
            log(`Failed to delete guild ${guildId}`, 'warn');
        }
    }
};