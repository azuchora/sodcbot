const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const mongo = require('../handlers/mongo');

module.exports = class extends Client {
    collection = {
        interactionCommands: new Collection(),
        components: {

        },
        trackedServers: new Collection(),
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
        mongo();
        await this.login(config.DISCORD_TOKEN);
        deploy(this);
    };
};