const { log } = require('../tools/logger');
const { Events, Interaction } = require('discord.js');
const ExtendedClient = require('../structures/ExtendedClient');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */
    execute: async (client, interaction) => {
        if(interaction.isButton()){
            const component = client.collection.components.buttons.get(interaction.customId);
            
            if (!component) return;

            try{
                component.execute(client, interaction);
            } catch (error) {
                log(error, 'err');
            }
            
            return;
        };

        
        if (interaction.isModalSubmit()){
            const component = client.collection.components.modals.get(interaction.customId);
            
            if (!component) return;
            
            try{
                component.execute(client, interaction);
            } catch (error) {
                log(error, 'err');
            };
            
            return;
        };
        
        if (interaction.isAnySelectMenu()){
            const component = client.collection.components.selects.get(interaction.customId);

            if (!component) return;

            try{
                component.execute(client, interaction);
            } catch (error) {
                log(error, 'err');
            }

            return;
        };

        if (interaction.isAutocomplete()){
            const component = client.collection.components.autocomplete.get(interaction.commandName);

            if (!component) return;

            try{
                component.execute(client, interaction);
            } catch (error) {
                log(error, 'err');
            }

            return;
        };
    }
};