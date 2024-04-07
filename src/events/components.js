const { log } = require('../tools/logger');
const { Events, Interaction, Collection } = require('discord.js');
const ExtendedClient = require('../structures/ExtendedClient');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */
    execute: async (client, interaction) => {
        const { cooldowns } = client.collection;

        if(interaction.isButton()){
            const component = client.collection.components.buttons.get(interaction.customId);
            if (!component) return;

            if(!cooldowns.has(component.customId)){
                cooldowns.set(component.customId, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(component.customId);
            const defaultCooldownDuration = 2;
            const cooldownAmount = (component.cooldown ?? defaultCooldownDuration) * 1_000;

            if(timestamps.has(interaction.user.id)){
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${component.customId}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

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