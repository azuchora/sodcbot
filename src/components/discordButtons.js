const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const SUCCESS = ButtonStyle.Success;
const DANGER = ButtonStyle.Danger;
const PRIMARY = ButtonStyle.Primary;
const SECONDARY = ButtonStyle.Secondary;
const LINK = ButtonStyle.Link;

module.exports = {
    getButton: function(options = {}){
        const button = new ButtonBuilder();

        if (options.customId) button.setCustomId(options.customId);
        if (options.label) button.setLabel(options.label);
        if (options.style) button.setStyle(options.style);
        if (options.url) button.setURL(options.url);
        if (options.emoji) button.setEmoji(options.emoji);
        if (options.disabled) button.setDisabled(options.disabled);

        return button;
    },
    getTestButton: function(){
        const testButton = module.exports.getButton({
            customId: 'testButton',
            style: DANGER,
            label: 'test',
        });

        return new ActionRowBuilder().addComponents(testButton);
    },
    getTrackerButtons: function(tracker){
        const activeButton = module.exports.getButton({
            customId: 'trackerActiveButton',
            style: (tracker.active) ? SUCCESS : DANGER,
            label: 'ACTIVE',
        });

        const addPlayerBmButton = module.exports.getButton({
            customId: 'trackerAddPlayerBmButton',
            style: SUCCESS,
            label: 'ADD PLAYER (B)',
            disabled: (!tracker.active) ? true : false,
        });

        const addPlayerSteamButton = module.exports.getButton({
            customId: 'trackerAddPlayerSteamButton',
            style: SUCCESS,
            label: 'ADD PLAYER (S)',
            disabled: (!tracker.active) ? true : false,
        });

        const addPlayerButton = module.exports.getButton({
            customId: 'trackerAddPlayerButton',
            style: SUCCESS,
            label: 'ADD PLAYER',
            disabled: (!tracker.active) ? true : false,
        });

        const refreshTrackerButton = module.exports.getButton({
            customId: 'trackerRefreshButton',
            style: SECONDARY,
            emoji: '♻',
            disabled: (!tracker.active) ? true : false,
        });

        const firstRow = new ActionRowBuilder().addComponents(activeButton, addPlayerButton, addPlayerBmButton, addPlayerSteamButton, refreshTrackerButton);

        const removePlayerButton = module.exports.getButton({
            customId: 'trackerRemovePlayerButton',
            style: DANGER,
            label: 'REMOVE PLAYER',
            disabled: (tracker.active) ? ((tracker.players.length == 0) ? true : false) : true ,
        });

        const editTrackerButton = module.exports.getButton({
            customId: 'trackerEditButton',
            style: PRIMARY,
            label: 'EDIT',
            disabled: (!tracker.active) ? true : false,
        });

        const deleteTrackerButton = module.exports.getButton({
            customId: 'trackerDeleteButton',
            style: SECONDARY,
            emoji: '🗑️',
        });

        const secondRow = new ActionRowBuilder().addComponents(removePlayerButton, editTrackerButton, deleteTrackerButton);
        
        return [firstRow, secondRow]; 
    },
};