const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');


module.exports = {
    getSelectMenu: function (options = {}) {
        const selectMenu = new StringSelectMenuBuilder();

        if (options.customId) selectMenu.setCustomId(options.customId);
        if (options.placeholder) selectMenu.setPlaceholder(options.placeholder);
        if (options.options) selectMenu.setOptions(options.options);
        if (options.disabled) selectMenu.setDisabled(options.disabled);
        if (options.min) selectMenu.setMinValues(options.min);
        if (options.max) selectMenu.setMaxValues(options.max);

        return selectMenu;
    },
    getTrackerRemovePlayerMenu: function (tracker){
        const items = [];
        for(const player of tracker.players){
            let desc = '';
            if(player.steamid && player.bmid) desc += `Steamid: ${player.steamid} Battlemetricsid: ${player.bmid}`;
            else if(player.steamid) desc += `Steamid: ${player.steamid}`;
            else desc += `Battlemetricsid: ${player.bmid}`;
            items.push({
                label: `${player.name}`,
                description: desc,
                value: `{"bmid": "${player.bmid}", "steamid": "${player.steamid}"}`,
            });
        }
        return new ActionRowBuilder().addComponents(    
            module.exports.getSelectMenu({
                customId: 'trackerRemovePlayerSteamSelect',
                options: items,
                min: 1,
                max: tracker.players.length,
            })
        );
    },
};