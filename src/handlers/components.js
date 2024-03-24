const fs = require('fs');
const path = require('path');
const { log } = require('../tools/logger');
const ExtendedClient = require('../structures/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
    const foldersPath = path.join(__dirname, '..', 'components');
    const componentsFolders = fs.readdirSync(foldersPath);

    for(const folder of componentsFolders){
        const componentsPath = path.join(foldersPath, folder);
        if(componentsPath.endsWith('.js')) continue;
        const componentFiles = fs.readdirSync(componentsPath).filter(file => file.endsWith('.js'));
        for(const file of componentFiles){
            const filePath = path.join(componentsPath, file);
            const component = require(filePath);

            if(!component) continue;

            switch(folder){
                case 'buttons':
                    if(!component.customId || !component.execute){
                        log(`Unable to load ${file}.`, 'warn');
                        continue;
                    }
                    client.collection.components.buttons.set(component.customId, component);
                    log(`Loaded new button: ${file}`, 'done');
                    break;

                case 'selects':
                    if(!component.customId || !component.execute){
                        log(`Unable to load ${file}.`, 'warn');
                        continue;
                    }
                    client.collection.components.selects.set(component.customId, component);
                    log(`Loaded new select: ${file}`, 'done');
                    break;
                
                case 'modals':
                    if(!component.customId || !component.execute){
                        log(`Unable to load ${file}.`, 'warn');
                        continue;
                    }
                    client.collection.components.modals.set(component.customId, component);
                    log(`Loaded new modal: ${file}`, 'done');
                    break;
                
                case 'autocomplete':
                    if(!component.customId || !component.execute){
                        log(`Unable to load ${file}.`, 'warn');
                        continue;
                    }
                    client.collection.components.autocomplete.set(component.customId, component);
                    log(`Loaded new autocomplete: ${file}`, 'done');
                    break;
                
                default:
                    log(`Invalid component type: ${file}`, 'warn');
                    break;
            }
        }
    }
};