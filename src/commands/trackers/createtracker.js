const { SlashCommandBuilder } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerEmbed } = require('../../components/discordEmbeds');
const { getTrackerButtons } = require('../../components/discordButtons');
const { updateGuild } = require('../../database/queries/guilds');
const GuildTools = require('../../tools/guilds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createtracker')
        .setDescription('Create new player tracker'),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const channel = interaction.channel;

        const tracker = {
            active: true,
            channelId: channel.id,
            channelName: channel.name,
            categoryId: channel.parent.id,
            catrgoryName: channel.parent.name,
            messageId: null,
            everyone: true,
            serverId: null,
            players: [],
            nameChangeHistory: [],
        };
        
        const message = await channel.send({embeds: [getTrackerEmbed(tracker)], components: getTrackerButtons(tracker)});
        tracker.messageId = message.id;
        guild.trackers.push(tracker);
        await updateGuild(guild);
        await interaction.reply({content: 'Succesfully created new tracker', ephemeral: true});
    }
};
