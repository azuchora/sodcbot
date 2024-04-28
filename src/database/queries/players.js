const PlayerSchema = require('../schemas/playerSessionsSchema');
const { log } = require('../../tools/logger');

module.exports = {
    getPlayerList: async function(){
        try{
            const playerList = await PlayerSchema.find();
            return playerList;
        } catch (error){
            log(`Failed to retrive player list from db.`, 'warn');
            return null;
        }
    },
    getPlayer: async function(bmid){
        try{
            const player = await PlayerSchema.findOne({ bmid });
            if(!player){
                return null;
            }
            return player;
        } catch (error){
            log(`Failed to get player ${bmid} from db.`, 'warn');
            return null;
        }
    },
    getPlayerById: async function(_id){
        try{
            const player = await PlayerSchema.findOne({ _id });
            if(!player){
                return null;
            }
            return player;
        } catch (error){
            log(`Failed to get player ${bmid} from db.`, 'warn');
            return null;
        }
    },
    createPlayer: async function(playerData) {
        try {
            const newPlayer = new PlayerSchema(playerData);
            await newPlayer.save();
            return newPlayer;
        } catch (error) {
            log('Failed to save player to db.', 'err');
            return null;
        }
    },
    updatePlayer: async function(bmid, data){
        try {
            const result = await PlayerSchema.updateOne({bmid: bmid}, data, { upsert: true });
        } catch(e){
            log(`Failed to update player ${bmid}`, 'warn');
        }
    },
    deletePlayer: async function(bmid, id = null){
        try{
            await PlayerSchema.deleteOne({$or:[
                { bmid: bmid },
                { _id: id},
            ]});
        } catch(e){
            log(`Failed to delete player ${bmid}`, 'warn');
        }
    }
};