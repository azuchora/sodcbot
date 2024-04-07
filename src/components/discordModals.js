const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ActionRow } = require('discord.js');

const SHORT = TextInputStyle.Short;
const LONG = TextInputStyle.Paragraph;

module.exports = {
    getModal: function(options = {}){
        const modal = new ModalBuilder();

        if(options.customId) modal.setCustomId(options.customId);
        if(options.title) modal.setTitle(options.title);

        return modal;
    },
    getTextInput: function(options = {}){
        const textInput = new TextInputBuilder();

        if (options.customId) textInput.setCustomId(options.customId);
        if (options.label) textInput.setLabel(options.label);
        if (options.value) textInput.setValue(options.value);
        if (options.style) textInput.setStyle(options.style);
        if (options.placeholder) textInput.setPlaceholder(options.placeholder);
        if (options.required) textInput.setRequired(options.required);

        return textInput;
    },
    getTrackerAddPlayerBmModal: function(){
        const modal = module.exports.getModal({
            customId: 'trackerAddPlayerBmModal',
            title: 'Add player',
        });
        
        const playerInput = module.exports.getTextInput({
            customId: 'addPlayerBm',
            label: 'Battlemetrics ID',
            value: '',
            style: SHORT,
            required: false,
        });

        modal.addComponents(
            new ActionRowBuilder().addComponents(playerInput),
        );

        return modal;
    },
    getTrackerAddPlayerSteamModal: function(){
        const modal = module.exports.getModal({
            customId: 'trackerAddPlayerSteamModal',
            title: 'Add player',
        });
        
        const playerInput = module.exports.getTextInput({
            customId: 'addPlayerSteam',
            label: 'Steamid',
            value: '',
            style: SHORT,
            required: false,
        });

        modal.addComponents(
            new ActionRowBuilder().addComponents(playerInput),
        );

        return modal;
    },
    getTrackerAddPlayerModal: function(){
        const modal = module.exports.getModal({
            customId: 'trackerAddPlayerModal',
            title: 'Add player',
        });
        
        const playerSteamInput = module.exports.getTextInput({
            customId: 'addPlayerBm',
            label: 'Battlemetrics ID',
            value: '',
            style: SHORT,
            required: false,
        });

        const playerBmInput = module.exports.getTextInput({
            customId: 'addPlayerSteam',
            label: 'Steamid',
            value: '',
            style: SHORT,
            required: false,
        });


        modal.addComponents(
            new ActionRowBuilder().addComponents(playerBmInput),
            new ActionRowBuilder().addComponents(playerSteamInput),
        );

        return modal;
    },
    getTrackerEditModal: function(tracker){
        const modal = module.exports.getModal({
            customId: 'trackerEditModal',
            title: 'Edit tracker',
        });

        const nameInput = module.exports.getTextInput({
            customId: 'trackerName',
            label: 'Tracker name',
            value: `${tracker.name}`,
            style: SHORT,
            required: false,
        });

        const serverInput = module.exports.getTextInput({
            customId: 'serverId',
            label: 'Serverid',
            value: `${tracker.serverId}`,
            style: SHORT,
            required: false,
        });


        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(serverInput),
        );

        return modal;
    },
};