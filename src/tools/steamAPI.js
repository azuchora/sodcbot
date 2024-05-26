const { STEAM_TOKEN } = require("../config");
const { log } = require("./logger");

const request = async (url) => {
    try{
        return await fetch(url, {
            method: 'GET',
        });
    }
    catch (e){
        return {};
    }
}

module.exports = {
    getSteamPlayerPage: async function (client, steamId){
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_TOKEN}&steamids=${steamId}`;
        const response = await request(url);
        if(!response.ok){
            log(`Failed to get steam player page: ${steamId}`, 'warn');
            return null;
        }
        return await response.json();
    },
    getSteamPlayerInfo: async function (client, steamId, page = null){
        if (page === null){
            page = await module.exports.getSteamPlayerPage(client, steamId);
            if(page === null){
                log(`Failed to get steam player info ${steamId}`, 'warn');
                return null;
            }
        }
        try{
            return page.response.players[0];
        }
        catch(e){}
        return null;
    },
    getSteamFriendListPage: async function (client, steamId){
        const url = `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_TOKEN}&steamid=${steamId}&relationship=friend`;
        const response = await request(url);
        if(!response.ok){
            log(`Failed to get steam player page: ${steamId}`, 'warn');
            return null;
        }
        return await response.json();
    },
    getSteamFiendList: async function (client, steamId){
        const page = await module.exports.getSteamFriendListPage(client, steamId);
        if(page === null){
            return null;
        }
        try{
            return page.friendslist;
        }
        catch(e){}
        return null;
    }
};