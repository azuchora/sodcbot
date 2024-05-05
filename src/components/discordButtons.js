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

        const showSleepButton = module.exports.getButton({
            customId: 'trackerSleepButton',
            style: SECONDARY,
            emoji: '🛌',
            disabled: (!tracker.active) ? true : false,
        });

        const refreshTrackerButton = module.exports.getButton({
            customId: 'trackerRefreshButton',
            style: SECONDARY,
            emoji: '♻',
            disabled: (!tracker.active) ? true : false,
        });

        const firstRow = new ActionRowBuilder().addComponents(addPlayerButton, addPlayerBmButton, addPlayerSteamButton, showSleepButton, refreshTrackerButton);

        const activeButton = module.exports.getButton({
            customId: 'trackerActiveButton',
            style: (tracker.active) ? SUCCESS : DANGER,
            label: 'ACTIVE',
        });

        const everyoneButton = module.exports.getButton({
            customId: 'trackerEveryoneButton',
            style: (tracker.everyone) ? SUCCESS : DANGER,
            label: '@everyone',
            disabled: (!tracker.active) ? true : false,
        });

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


        const secondRow = new ActionRowBuilder().addComponents(activeButton, everyoneButton, removePlayerButton, editTrackerButton, deleteTrackerButton);
        
        return [firstRow, secondRow]; 
    },
    getPlayerTrackerButtons: function(tracker){
        const refreshTrackerButton = module.exports.getButton({
            customId: 'trackerRefreshButton_',
            style: SECONDARY,
            emoji: '♻',
            disabled: (!tracker.active) ? true : false,
        });

        const activeButton = module.exports.getButton({
            customId: 'trackerActiveButton_',
            style: (tracker.active) ? SUCCESS : DANGER,
            label: 'ACTIVE',
        });

        const editTrackerButton = module.exports.getButton({
            customId: 'trackerEditButton_',
            style: PRIMARY,
            label: 'EDIT',
            disabled: (!tracker.active) ? true : false,
        });
        
        const firstButtonsRow = new ActionRowBuilder().addComponents(activeButton, editTrackerButton, refreshTrackerButton);

        const everyoneButton = module.exports.getButton({
            customId: 'trackerEveryoneButton_',
            style: (tracker.everyone) ? SUCCESS : DANGER,
            label: '@everyone',
            disabled: (!tracker.active) ? true : false,
        });


        const deleteTrackerButton = module.exports.getButton({
            customId: 'trackerDeleteButton_',
            style: SECONDARY,
            emoji: '🗑️',
        });

        const showPlayerSleepButton = module.exports.getButton({
            customId: 'trackerSleepButton_',
            style: SECONDARY,
            emoji: '🛌',
            disabled: (!tracker.active) ? true : false,
        });

        const secondButtonsRow = new ActionRowBuilder().addComponents(everyoneButton, showPlayerSleepButton, deleteTrackerButton);

        return [firstButtonsRow, secondButtonsRow]; 
    },
};
