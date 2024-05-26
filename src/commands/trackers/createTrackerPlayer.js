const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getPlayerTrackerEmbed } = require('../../components/discordEmbeds');
const { getPlayerTrackerButtons } = require('../../components/discordButtons');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { updateGuild } = require('../../database/queries/guilds');
const { updateTracker } = require('../../tools/trackers');
const { getGuild } = require('../../tools/guilds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createplayer')
        .setDescription('Create new player tracker')
        .addStringOption(option =>
            option
                .setName('playerid')
                .setDescription('BattlemetricsID')
                .setRequired(true)),
        // .setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        await interaction.deferReply({ ephemeral: true });
        const playerId = interaction.options.getString('playerid');
        
        const playerData = await getBattlemetricsPlayerInfo(client, playerId);
        
        if(!playerData){
            await interaction.followUp({ content: 'Failed to find player.', ephemeral: true });
            return;
        }

        const guild = await client.guilds.fetch(interaction.guild.id);
        const channel = interaction.channel;

        const guildInfo = await getGuild(interaction.guild.id);

        const tracker = {
            isSingle: true,
            name: 'Player tracker',
            active: true,
            channelId: channel?.id,
            channelName: channel?.name,
            categoryId: channel?.parentId,
            categoryName: channel?.parent?.name,
            messageId: null,
            threadId: null,
            everyone: true,
            onlineCount: 0,
            nameChangeHistory: [],
            players: [
                {
                    bmid: playerId,
                    name: playerData.name,
                    status: playerData.lastSeen.online,
                    nameHistory: playerData.nameHistory,
                    playTime: playerData.playTime,
                    lastSeen: playerData.lastSeen,
                }
            ],
        };
        const trackerEmbed = getPlayerTrackerEmbed(tracker);
        const message = await channel.send({ embeds: [trackerEmbed], components: getPlayerTrackerButtons(tracker) });
        tracker.messageId = message.id;
        await interaction.followUp({ content: 'Successfully started tracking.', ephemeral: true });
        await updateTracker(client, tracker, false, guild, guildInfo);
        guildInfo.trackers.push(tracker);
        await updateGuild(guildInfo);
    }
};
