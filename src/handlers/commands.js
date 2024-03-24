const fs = require('node:fs');
const path = require('node:path');
const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require('../tools/logger');

/**
 * 
 * @param {ExtendedClient} client 
 */

module.exports = (client) => {
    const foldersPath = path.join(__dirname, '..', 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for(const folder of commandFolders){
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for(const file of commandFiles){
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if(!command) continue;

            if ('data' in command && 'execute' in command){
                client.collection.interactionCommands.set(command.data.name, command);
                client.applicationCommandsArray.push(command.data);
                log(`Loaded command ${command.data.name}`, 'done');
            } else {
                log(`Failed to load ${filePath}`, 'warn');
            }
        }
    }
}