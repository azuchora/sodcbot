const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");

module.exports = class extends Client {
    collection = {
        interactionCommands: new Collection(),
        components: {

        }
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

        await this.login(config.DISCORD_TOKEN);
        deploy(this);
    };
};