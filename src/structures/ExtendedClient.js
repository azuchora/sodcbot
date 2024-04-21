const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongo = require('../handlers/mongo');
const components = require('../handlers/components');

module.exports = class extends Client {
    collection = {
        interactionCommands: new Collection(),
        components: {
            buttons: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection(),
            selects: new Collection(),
        },
        trackedServers: new Collection(),
        cooldowns: new Collection(),
    };
    applicationCommandsArray = [];

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
        });
    };

    start = async () => {
        commands(this);
        events(this);
        components(this);
        mongo();
        await this.login(config.DISCORD_TOKEN);
        deploy(this);
    };

};