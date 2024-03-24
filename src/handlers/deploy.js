const { REST, Routes } = require('discord.js');
const config = require('../config.js');
const ExtendedClient = require('../structures/ExtendedClient.js');
const { log } = require('../tools/logger.js');

/**
 * 
 * @param {ExtendedClient} client 
 */

module.exports = async (client) => {
    const rest = new REST().setToken(config.DISCORD_TOKEN);

    try{
        log('Registering slash commands...', 'info');
        await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
            body: client.applicationCommandsArray
        })
        log('Succesfully registered slash commands.', 'done');
    } catch (e) {
        log('Unable to register slash commands', 'err');
    }
}