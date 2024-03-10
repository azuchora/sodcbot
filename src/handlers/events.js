const fs = require('node:fs');
const path = require('node:path');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for(const file of eventFiles){
        const filePath = path.join(eventsPath, file);
        const module = require(filePath);
        
        if(module.once){
            client.once(module.name, (...args) => module.execute(...args));
        } else {
            client.on(module.name, (...args) => module.execute(...args));
        }
    }
}