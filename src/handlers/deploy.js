const { REST, Routes } = require('discord.js');
const config = require('../config.js');
const ExtendedClient = require('../structures/ExtendedClient.js');

/**
 * 
 * @param {ExtendedClient} client 
 */

module.exports = async (client) => {
    const rest = new REST().setToken(config.DISCORD_TOKEN);

    try{
        console.log('Registering slash commands...');
        await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
            body: client.applicationCommandsArray
        })
    } catch (e) {
        console.log('Unable to register slash commands');
    }
}