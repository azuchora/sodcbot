const { SlashCommandBuilder } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getTrackerEmbed } = require('../../components/discordEmbeds');
const { getTrackerButtons } = require('../../components/discordButtons');
const { updateGuild } = require('../../database/queries/guilds');
const GuildTools = require('../../tools/guilds');
const { refreshTracker } = require('../../tools/discordTools');

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
        const guildInfo = await GuildTools.getGuild(interaction.guild.id);
        const guild = await client.guilds.fetch(interaction.guild.id);
        const channel = interaction.channel;

        const tracker = {
            name: 'Player tracker',
            active: true,
            channelId: channel.id,
            channelName: channel.name,
            categoryId: channel.parent.id,
            catrgoryName: channel.parent.name,
            messageId: null,
            threadId: null,
            everyone: true,
            serverId: null,
            onlineCount: 0,
            players: [],
            nameChangeHistory: [],
        };
        
        const message = await channel.send({embeds: [getTrackerEmbed(tracker)], components: getTrackerButtons(tracker)});
        tracker.messageId = message.id;
        guildInfo.trackers.push(tracker);
        await updateGuild(guildInfo);
        await interaction.reply({content: 'Succesfully created new tracker', ephemeral: true});
        await refreshTracker(client, tracker, null, guild, guildInfo);
    }
};
