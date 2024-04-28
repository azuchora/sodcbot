const PlayerQueries = require('../database/queries/players');
const ExtendedClient = require('../structures/ExtendedClient');
const { getBattlemetricsPlayerSessions } = require('./battleMetricsAPI');
const { log } = require("./logger");

module.exports = {
    getPlayerSessions: async function(playerId){
        let player = await PlayerQueries.getPlayer(playerId);
        if(!player){
            player = await module.exports.createPlayer(playerId);
        }
        let updateDate = new Date(player.updateDate);
        let dayAgo = new Date();
        dayAgo.setDate(new Date() - 1);
        if(updateDate <= dayAgo || player.updateDate == null){
            player = await module.exports.updatePlayerSessions(player, playerId);
        }
        return player.sessions.map((s) => {
            return {
                stop: s.stop,
                start: s.start,
                id: s.id,
                serverId: s.serverId,
            }
        });
    },
    updatePlayerSessions: async function(player, playerId){
        const sessions = await getBattlemetricsPlayerSessions(null, playerId);
        const newSessions = sessions.filter((s) => !player.sessions.some((ps) => s.id == ps.id));
        player.sessions.unshift(...newSessions);
        player.updateDate = Date();
        await PlayerQueries.updatePlayer(playerId, player);
        return player;
    },
    createPlayer: async function(playerId){
        const player = {
            bmid: playerId,
            updateDate: null,
            sessions: [],
        };
        log(`Created player ${playerId}`,'info');
        await PlayerQueries.updatePlayer(player.bmid, player);
        return player;
    },
};