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
    }
};